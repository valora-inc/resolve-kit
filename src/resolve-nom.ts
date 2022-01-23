import { NameResolver, NameResolutionResults } from './types'

export class ResolveNom implements NameResolver {
  async resolve(id: string): Promise<NameResolutionResults> {
    return {
      nameResolutions: [],
      errors: [
        {
          kind: 'nom',
          error: new Error(`Unable to resolve ${id}: not implemented`),
        },
      ],
    }
  }
}
