import { NameResolver, NameResolutionResults, ResolutionKind } from './types'

import { createPublicClient, http, HttpTransport, PublicClient } from 'viem'
import { mainnet } from 'viem/chains'
import { normalize } from 'viem/ens'

export type ViemClient = PublicClient<HttpTransport, typeof mainnet>

export class ResolveEns implements NameResolver {
  private viem: ViemClient

  constructor({ viem }: { viem?: ViemClient }) {
    if (viem) {
      this.viem = viem
    } else {
      this.viem = createPublicClient({
        chain: mainnet,
        transport: http(),
      })
    }
  }

  //
  // In practice users only setup an ethereum resolution.
  //
  // Return an ENS ethereum resolution if the .eth resolves only on ethereum,
  // but do not return a resolution if the .eth resolves on ethereum
  // and to  different addresses on multiple chains.
  //
  // This is a workaround for the Valora send flow implementation which expects
  // to have an address before the token/network is selected.
  //

  // https://github.com/satoshilabs/slips/blob/master/slip-0044.md
  private coinTypesToCheck = [
    52752, // Celo
  ]

  async resolve(id: string): Promise<NameResolutionResults> {
    if (!id.endsWith('.eth')) {
      return {
        resolutions: [],
        errors: [],
      }
    }
    const name = normalize(id)
    try {
      const ethereumAddressPromise = this.viem.getEnsAddress({
        name,
        coinType: BigInt(60), // Ethereum
      })

      const otherAddressesPromises = this.coinTypesToCheck.map((coinType) =>
        this.viem.getEnsAddress({
          name,
          coinType: BigInt(coinType),
        }),
      )

      const addresses = await Promise.all(
        [ethereumAddressPromise].concat(otherAddressesPromises),
      )

      if (addresses[0] === null) {
        return {
          resolutions: [],
          errors: [],
        }
      }

      const addressCount = new Set(addresses.filter((value) => value)).size

      if (addressCount > 1) {
        throw new Error(
          `More than one ENS resolution for ${id}: ${JSON.stringify(
            addresses,
          )}`,
        )
      }

      return {
        resolutions: [
          {
            kind: ResolutionKind.Ens,
            address: addresses[0],
          },
        ],
        errors: [],
      }
    } catch (error) {
      return {
        resolutions: [],
        errors: [
          {
            kind: ResolutionKind.Ens,
            error: error as Error,
          },
        ],
      }
    }
  }
}
