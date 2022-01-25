import { Address } from '@celo/base/lib/address'

export interface NameResolution {
  kind: string
  address: Address
}

export interface NameResolutionError {
  kind: string
  error: Error
}

export interface NameResolutionResults {
  resolutions: NameResolution[]
  errors: NameResolutionError[]
}

export interface NameResolver {
  resolve(id: string): Promise<NameResolutionResults>
}
