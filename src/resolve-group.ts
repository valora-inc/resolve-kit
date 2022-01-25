import { NameResolver, NameResolutionResults } from './types'

export class ResolveGroup implements NameResolver {
  private resolvers: NameResolver[]

  constructor(resolvers: NameResolver[]) {
    this.resolvers = resolvers
  }

  async resolve(id: string): Promise<NameResolutionResults> {
    const results = await Promise.all(
      this.resolvers.map((resolver) => resolver.resolve(id)),
    )
    const resolutions = results.flatMap((result) => result.resolutions)
    const errors = results.flatMap((result) => result.errors)
    return { resolutions, errors }
  }
}
