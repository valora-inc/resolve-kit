# resolve-kit

Resolve an identifier to a Celo address.

## Adding

```
yarn add @valora/resolve-kit
```

## Example

```ts
import { newKit } from '@celo/contractkit'
import { NomKit } from '@nomspace/nomspace'
import { ResolveGroup, ResolveAddress, ResolveNom } from '@valora/resolve-kit'

const kit = newKit('https://forno.celo.org')
const nomKit = new NomKit(kit, ResolveNom.MainnetContractAddress)

const resolver = new ResolveGroup([
  new ResolveAddress(),
  new ResolveNom(nomKit),
])
const resolutions = await resolver.resolve(args.id)

console.log('results:', resolutions.nameResolutions)
console.log('errors:', resolutions.errors)
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
