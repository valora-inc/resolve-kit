import { isValidAddress } from '@celo/utils/lib/address'
import { NameResolver, NameResolutionResults } from './types'

export class ResolveAddress implements NameResolver {
  async resolve(id: string): Promise<NameResolutionResults> {
    if (isValidAddress(id)) {
      return {
        resolutions: [
          {
            kind: 'address',
            address: id,
          },
        ],
        errors: [],
      }
    }
    return { resolutions: [], errors: [] }
  }
}
