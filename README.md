# resolve-kit

Resolve an identifier to a Celo address.

## Adding

```
yarn add @valora/resolve-kit
```

## Example usage

```ts
import {
  ResolveGroup,
  ResolveAddress,
  ResovleNom,
} from '@valora/resolve-kit'

const resolver = new ResolveGroup([new ResolveAddress(), new ResolveNom()])

console.log('results:', resolver.resolve('something').nameResolutions)
console.log('errors:', resolver.resolve('something').errors)
```
