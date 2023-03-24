import Web3 from 'web3'
import { Address } from '@celo/base/lib/address'
import { AbiItem } from 'web3-utils'
import { Contract } from 'web3-eth-contract'
import { OdisUtils } from '@celo/identity'
import { AuthSigner, ServiceContext } from '@celo/identity/lib/odis/query'

import { NameResolver, NameResolutionResults, ResolutionKind } from './types'

const DEFAULT_NETWORK_TIMEOUT = 5_000

export class ResolveCelo implements NameResolver {
  private federatedAttestationsContract: Contract
  private trustedIssuers: Record<Address, string>
  private authSigner: AuthSigner
  private account: Address
  private serviceContext: ServiceContext
  private networkTimeout: number

  static readonly FederatedAttestationsContractAbi: AbiItem[] =
    require('./abis/FederatedAttestations.json').abi

  // https://github.com/celo-org/SocialConnect/blob/main/protocol.md#smart-contract-addresses
  static readonly AlfajoresFederatedAttestationsProxyContractAddress: Address =
    '0x70F9314aF173c246669cFb0EEe79F9Cfd9C34ee3'
  static readonly MainnetFederatedAttestationsProxyContractAddress: Address =
    '0x0aD5b1d0C25ecF6266Dd951403723B2687d6aff2'

  static readonly AlfajoresDefaultTrustedIssuers: Record<Address, string> = {
    '0xe3475047EF9F9231CD6fAe02B3cBc5148E8eB2c8': 'Libera',
  }
  static readonly MainnetDefaultTrustedIssuers: Record<Address, string> = {
    '0x6549aF2688e07907C1b821cA44d6d65872737f05': 'Kaala',
    '0xff7f2af3f451318aFb0819fDeE8f1d6306C0fbEe': 'Node Finance',
    '0x388612590F8cC6577F19c9b61811475Aa432CB44': 'Libera',
  }

  constructor({
    providerUrl,
    federatedAttestationsProxyContractAddress,
    trustedIssuers,
    authSigner,
    account,
    serviceContext,
    networkTimeout,
  }: {
    providerUrl: string
    federatedAttestationsProxyContractAddress: Address
    trustedIssuers: Record<string, Address>
    authSigner: AuthSigner
    account: Address
    serviceContext: ServiceContext
    networkTimeout?: number
  }) {
    this.networkTimeout = networkTimeout ?? DEFAULT_NETWORK_TIMEOUT
    const web3 = new Web3(
      new Web3.providers.HttpProvider(providerUrl, {
        timeout: this.networkTimeout,
      }),
    )
    const federatedAttestationsContract = new web3.eth.Contract(
      ResolveCelo.FederatedAttestationsContractAbi,
      federatedAttestationsProxyContractAddress,
    )

    this.federatedAttestationsContract = federatedAttestationsContract
    this.trustedIssuers = trustedIssuers
    this.authSigner = authSigner
    this.account = account
    this.serviceContext = serviceContext
  }

  async resolve(id: string): Promise<NameResolutionResults> {
    let timer: ReturnType<typeof setTimeout> | null = null
    try {
      const abortController = new AbortController()
      timer = setTimeout(() => abortController.abort(), this.networkTimeout)
      const identifier = (
        await OdisUtils.Identifier.getObfuscatedIdentifier(
          id,
          OdisUtils.Identifier.IdentifierPrefix.PHONE_NUMBER,
          this.account,
          this.authSigner,
          this.serviceContext,
          undefined, // blindingFactor
          undefined, // clientVersion
          undefined, // blsBlindingClient
          undefined, // sessionID
          undefined, // keyVersion
          undefined, // endpoint
          abortController,
        )
      ).obfuscatedIdentifier
      clearTimeout(timer)

      const issuers = Object.keys(this.trustedIssuers)
      const attestations = await this.federatedAttestationsContract.methods
        .lookupAttestations(identifier, issuers)
        .call()

      let totalCount = 0
      const issuerAddresses: { issuerName: string; address: Address }[] = []

      // .lookupAttestations returns an object with .accounts and .countsPerIssuer.
      // .countsPerIssuer specifies for each issuer, how many addresses it resolved.
      //
      // E.g., .lookupAttestations(..., ['0x1', '0x2']) ->
      //   { accounts: ['0xf00', '0xd00'], countsPerIssuer: ['1', '1']}
      //   0x1 issuer returns 0xf00 and 0x2 issuer returns 0xd00.
      //
      // We map issuer names to addresses that issuer resolved in the loop below.
      for (
        let index = 0;
        index < attestations.countsPerIssuer.length;
        index++
      ) {
        const issuer = issuers[index]
        const count = parseInt(attestations.countsPerIssuer[index], 10)
        if (Number.isNaN(count)) {
          throw new Error(
            `Issuer count parses to NaN: ${attestations.countsPerIssuer[index]}`,
          )
        }
        const addresses = attestations.accounts.slice(
          totalCount,
          totalCount + count,
        )
        const issuerName = this.trustedIssuers[issuer]
        issuerAddresses.push(
          ...addresses.map((address: Address) => ({ issuerName, address })),
        )
        totalCount += count
      }

      return {
        resolutions: issuerAddresses.map(
          ({
            issuerName,
            address,
          }: {
            issuerName: string
            address: Address
          }) => ({
            kind: ResolutionKind.Celo,
            issuerName,
            address,
          }),
        ),
        errors: [],
      }
    } catch (error) {
      if (timer) {
        clearTimeout(timer)
      }
      return {
        resolutions: [],
        errors: [{ kind: ResolutionKind.Celo, error: error as Error }],
      }
    }
  }
}
