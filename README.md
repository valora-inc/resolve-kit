# resolve-kit

Resolve an identifier to a Celo address.

## Adding

```
yarn add @valora/resolve-kit
```

## Example

```ts
import { newKit } from '@celo/contractkit'
import { ResolveGroup, ResolveAddress, ResolveNom } from '@valora/resolve-kit'

const kit = newKit('https://forno.celo.org')

const resolver = new ResolveGroup([
  new ResolveAddress(),
  new ResolveNom({ kit, contractAddress: ResolveNom.MainnetContractAddress }),
])

// Likely resolve 'foo' to a nom with a resolution address
const foo = await resolver.resolve('foo')
console.log('foo resolutions:', foo.resolutions)
console.log('foo errors:', foo.errors)

// Resolves 0x1212121212121212121212121212121212121212 to an address
const address = await resolver.resolve('0x1212121212121212121212121212121212121212')
console.log('address resolutions:', address.resolutions)
console.log('address errors:', address.errors)
```

## Developing

Install dependencies:

```
yarn
```

Run tests:

```
yarn test
```

Run the [example CLI](scripts/resolve.ts):

```
yarn resolve --id foo
yarn resolve --id 0x1212121212121212121212121212121212121212
yarn resolve --id 0x121212121212121212121212121212121212121
```
