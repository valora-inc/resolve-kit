import { Address } from '@celo/base/lib/address'

export enum ResolutionKind {
  Address = 'address',
  Nom = 'nom',
  Celo = 'celo',
}

export interface NameResolution {
  kind: ResolutionKind
  address: Address
  name?: string
  thumbnailPath?: string
}

export interface NameResolutionError {
  kind: ResolutionKind
  error: Error
}

export interface NameResolutionResults {
  resolutions: NameResolution[]
  errors: NameResolutionError[]
}

export interface NameResolver {
  resolve(id: string): Promise<NameResolutionResults>
}
