import { Address } from '@celo/base/lib/address'

export enum ResolutionKind {
  Address = 'address',
  Nom = 'nom',
  SocialConnect = 'socialconnect',
}

export interface NameResolution {
  // Method of resolution
  kind: ResolutionKind
  // Address of resolution
  address: Address
  // Name of entity that created the resolution. For example, 'Kaala' might
  // create a resolution on SocialConnect.
  issuerName?: string
  // The resolve method might perform some normalization on the ID passed in.
  // This is the result of that normalization.
  name?: string
  // TODO: remove?
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
