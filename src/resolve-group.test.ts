import { NameResolver, NameResolutionResults } from './types'
import { ResolveGroup } from './resolve-group'

class ResolveSuccess implements NameResolver {
  async resolve(id: string): Promise<NameResolutionResults> {
    return {
      nameResolutions: [
        {
          kind: 'success',
          address: id,
        },
      ],
      errors: [],
    }
  }
}

class ResolveError implements NameResolver {
  async resolve(_: string): Promise<NameResolutionResults> {
    return {
      nameResolutions: [],
      errors: [
        {
          kind: 'error',
          error: new Error('foo'),
        },
      ],
    }
  }
}

describe('resolve-group', () => {
  describe('ResolveGroup', () => {
    it('returns successes and errors', async () => {
      const resolver = new ResolveGroup([
        new ResolveSuccess(),
        new ResolveError(),
        new ResolveSuccess(),
      ])
      const resolutions = await resolver.resolve('foo')

      expect(resolutions.nameResolutions.length).toBe(2)
      expect(resolutions.errors.length).toBe(1)
    })
  })
})
