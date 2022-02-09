/* eslint no-console: "off" */
import yargs from 'yargs'

import { ResolveGroup, ResolveAddress, ResolveNom } from '../src'

async function main(args: any) {
  const providerUrl = 'https://forno.celo.org'

  const resolver = new ResolveGroup([
    new ResolveAddress(),
    new ResolveNom({
      providerUrl,
      ensRegistryAddress: ResolveNom.MainnetENSRegsitryAddress,
    }),
  ])
  const resolutions = await resolver.resolve(args.id)

  if (resolutions.errors.length) {
    console.log('errors:', resolutions.errors)
  }
  console.log('results:', resolutions.resolutions)
}

function parseArgs() {
  return yargs
    .option('id', {
      description: 'Identifier to resolve',
      type: 'string',
      demandOption: true,
    })
    .strict().argv
}

main(parseArgs())
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })
