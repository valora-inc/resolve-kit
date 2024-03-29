/* eslint no-console: "off" */
import yargs from 'yargs'

import {
  ResolveAddress,
  ResolveGroup,
  ResolveMasa,
  ResolveSocialConnect,
  ResolveEns,
} from '../src'

import { OdisUtils } from '@celo/identity'
import { OdisContextName } from '@celo/identity/lib/odis/query'

import { newKit } from '@celo/contractkit'

const NETWORKS: Record<string, any> = {
  alfajores: {
    providerUrl: 'https://alfajores-forno.celo-testnet.org',
    federatedAttestationsProxyContractAddress:
      ResolveSocialConnect.AlfajoresFederatedAttestationsProxyContractAddress,
    trustedIssuers: ResolveSocialConnect.AlfajoresDefaultTrustedIssuers,
    odisContextName: OdisContextName.ALFAJORES,
  },
  mainnet: {
    providerUrl: 'https://forno.celo.org',
    federatedAttestationsProxyContractAddress:
      ResolveSocialConnect.MainnetFederatedAttestationsProxyContractAddress,
    trustedIssuers: ResolveSocialConnect.MainnetDefaultTrustedIssuers,
    odisContextName: OdisContextName.MAINNET,
  },
}

async function main(args: ReturnType<typeof parseArgs>) {
  const network = NETWORKS[args['network-id']]
  const providerUrl = network.providerUrl

  const resolvers = [
    new ResolveAddress(),
    new ResolveMasa({
      providerUrl,
      networkName: args['network-id'],
    }),
    new ResolveEns({}),
  ]

  if (args['private-key']) {
    const privateKey = args['private-key']
    const kit = await newKit(providerUrl)
    kit.addAccount(privateKey)
    const account =
      kit.web3.eth.accounts.privateKeyToAccount(privateKey).address
    const resolveCelo = new ResolveSocialConnect({
      providerUrl,
      federatedAttestationsProxyContractAddress:
        network.federatedAttestationsProxyContractAddress,
      // Pass in the account as a trusted issuer since we're likely using it
      // for ad hoc testing.
      trustedIssuers: { [account]: 'resolve-kit', ...network.trustedIssuers },
      authSigner: {
        authenticationMethod: OdisUtils.Query.AuthenticationMethod.WALLET_KEY,
        contractKit: kit,
      },
      account,
      serviceContext: OdisUtils.Query.getServiceContext(
        network.odisContextName,
      ),
    })

    resolvers.push(resolveCelo)
  }

  const resolver = new ResolveGroup(resolvers)
  const resolutions = await resolver.resolve(args.id)

  if (resolutions.errors.length) {
    console.log('errors:', resolutions.errors)
  }
  console.log('results:', resolutions.resolutions)
}

function parseArgs() {
  return yargs
    .option('network-id', {
      description: 'Celo network',
      type: 'string',
      choices: Object.keys(NETWORKS),
      default: 'alfajores',
    })
    .option('private-key', {
      description: 'Private key for ODIS lookup',
      type: 'string',
    })
    .option('id', {
      description: 'Identifier to resolve',
      type: 'string',
      demandOption: true,
    })
    .strict()
    .parseSync()
}

main(parseArgs())
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })
