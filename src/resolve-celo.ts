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
  private authSigner: AuthSigner
  private account: Address
  private serviceContext: ServiceContext
  private networkTimeout: number

  static readonly FederatedAttestationsContractAbi: AbiItem[] =
    require('./abis/FederatedAttestations.json').abi

  // https://github.com/celo-org/identity/blob/ASv2/asv2/protocol.md#smart-contract-addresses
  static readonly AlfajoresFederatedAttestationsProxyContractAddress: Address =
    '0x70F9314aF173c246669cFb0EEe79F9Cfd9C34ee3'
  static readonly MainnetFederatedAttestationsProxyContractAddress: Address =
    '0x0aD5b1d0C25ecF6266Dd951403723B2687d6aff2'

  constructor({
    providerUrl,
    federatedAttestationsProxyContractAddress,
    authSigner,
    account,
    serviceContext,
    networkTimeout,
  }: {
    providerUrl: string
    federatedAttestationsProxyContractAddress: Address
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

      const attestations = await this.federatedAttestationsContract.methods
        .lookupAttestations(identifier, [this.account])
        .call()

      return {
        resolutions: attestations.accounts.map((address: Address) => ({
          kind: ResolutionKind.Celo,
          address,
        })),
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
