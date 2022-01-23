export interface NameResolution {
  kind: string
  address: string
}

export interface NameResolutionError {
  kind: string
  error: Error
}

export interface NameResolutionResults {
  nameResolutions: NameResolution[]
  errors: NameResolutionError[]
}

export interface NameResolver {
  resolve(id: string): Promise<NameResolutionResults>
}
