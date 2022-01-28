import { Address } from '@celo/base/lib/address'
import { ContractKit } from '@celo/contractkit'
import { NomKit } from '@nomspace/nomspace'
import { NameResolver, NameResolutionResults, ResolutionKind } from './types'

const NullNomResolution = '0x0000000000000000000000000000000000000000'

export class ResolveNom implements NameResolver {
  static readonly MainnetContractAddress: Address =
    '0xABf8faBbC071F320F222A526A2e1fBE26429344d'
  static readonly AlfajoresContractAddress: Address =
    '0x36C976Da6A6499Cad683064F849afa69CD4dec2e'

  private nomKit: NomKit

  constructor({
    kit,
    contractAddress,
    nomKit,
  }: {
    kit?: ContractKit
    contractAddress?: Address
    nomKit?: NomKit
  }) {
    if (nomKit) {
      this.nomKit = nomKit
    } else if (kit && contractAddress) {
      this.nomKit = new NomKit(kit, contractAddress)
    } else {
      throw new Error('Missing kit and contractAddress')
    }
  }

  async resolve(id: string): Promise<NameResolutionResults> {
    if (!id.endsWith('.nom')) {
      return {
        resolutions: [],
        errors: [],
      }
    }

    const name = id.substring(0, id.length - '.nom'.length)

    // Only ids with fewer than 32 bytes are valid noms.
    if (Buffer.byteLength(name, 'utf8') < 32) {
      try {
        const resolution = await this.nomKit.resolve(name)
        if (resolution !== NullNomResolution) {
          return {
            resolutions: [
              {
                kind: ResolutionKind.Nom,
                address: resolution,
                name,
              },
            ],
            errors: [],
          }
        }
      } catch (error) {
        return {
          resolutions: [],
          errors: [
            {
              kind: ResolutionKind.Nom,
              error: error as Error,
            },
          ],
        }
      }
    }

    return {
      resolutions: [],
      errors: [],
    }
  }
}
