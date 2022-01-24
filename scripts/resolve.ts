/* eslint no-console: "off" */
import { newKit } from '@celo/contractkit'
import { NomKit } from '@nomspace/nomspace'
import yargs from 'yargs'

import { ResolveGroup, ResolveAddress, ResolveNom } from '../src'

async function main(args: any) {
  const kit = newKit('https://forno.celo.org')
  const nomKit = new NomKit(kit, ResolveNom.MainnetContractAddress)

  const resolver = new ResolveGroup([
    new ResolveAddress(),
    new ResolveNom(nomKit),
  ])
  const resolutions = await resolver.resolve(args.id)

  if (resolutions.errors.length) {
    console.log('errors:', resolutions.errors)
  }
  console.log('results:', resolutions.nameResolutions)
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
