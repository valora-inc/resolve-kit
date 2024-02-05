import { NameResolutionResults, NameResolver, ResolutionKind } from './types'

import { VoidSigner, constants, providers } from 'ethers'
import { Masa } from '@masa-finance/masa-sdk'

export class ResolveMasa implements NameResolver {
  masa: Masa

  constructor({
    providerUrl,
    networkName,
    masa,
  }: {
    providerUrl?: string
    networkName?: string
    masa?: Masa
  }) {
    this.masa = masa
      ? masa
      : new Masa({
          signer: new VoidSigner(
            constants.AddressZero,
            new providers.JsonRpcProvider(providerUrl),
          ),
          networkName: networkName === 'mainnet' ? 'celo' : 'alfajores',
        })
  }

  async resolve(id: string): Promise<NameResolutionResults> {
    const result: NameResolutionResults = {
      resolutions: [],
      errors: [],
    }

    try {
      const extension =
        await this.masa.contracts.instances.SoulNameContract.extension()

      if (!id.endsWith(extension)) {
        return result
      }

      const name = id.replace(extension, '')

      const address = await this.masa.soulName.resolve(name)
      if (address) {
        result.resolutions.push({
          kind: ResolutionKind.Masa,
          address,
          name,
        })
      }
    } catch (error) {
      result.errors.push({
        kind: ResolutionKind.Masa,
        error: error as Error,
      })
    }

    return result
  }
}
