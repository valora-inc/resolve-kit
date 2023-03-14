import { ResolveCelo } from './resolve-celo'
import { AuthSigner, ServiceContext } from '@celo/identity/lib/odis/query'
import Web3 from 'web3'
import * as Identity from '@celo/identity'

jest.mock('web3')
jest.mock('@celo/identity')

describe('resolve-celo', () => {
  describe('ResolveCelo', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })

    it('returns the expected resolutions', async () => {
      const Web3Mock: any = jest.mocked(Web3)
      Web3Mock.mockImplementation(() => {
        return {
          eth: {
            Contract: jest.fn().mockImplementation(() => ({
              methods: {
                lookupAttestations: () => {
                  return {
                    call: () => ({
                      accounts: ['0xf00ba7'],
                    }),
                  }
                },
              },
            })),
          },
        }
      })

      const identityMock: any = jest.mocked(Identity)
      identityMock.OdisUtils = {
        Identifier: {
          getObfuscatedIdentifier: () => ({ obfuscatedIdentifier: '' }),
          IdentifierPrefix: {},
        },
      }

      const authSigner = {} as any as AuthSigner
      const serviceContext = {} as any as ServiceContext

      const resolver = new ResolveCelo({
        providerUrl: 'http://does.not.matter',
        federatedAttestationsProxyContractAddress: '0x1',
        trustedIssuers: [],
        authSigner,
        account: '0x3',
        serviceContext,
      })

      const resolutions = await resolver.resolve('+18888888888')
      expect(resolutions.resolutions.length).toBe(1)
      expect(resolutions.errors.length).toBe(0)
      const resolution = resolutions.resolutions[0]
      expect(resolution.address).toBe('0xf00ba7')
    })

    it('returns errors on contract call error', async () => {
      const Web3Mock: any = jest.mocked(Web3)
      Web3Mock.mockImplementation(() => {
        return {
          eth: {
            Contract: jest.fn().mockImplementation(() => ({
              methods: {
                lookupAttestations: () => {
                  return {
                    call: () => {
                      throw new Error('foo')
                    },
                  }
                },
              },
            })),
          },
        }
      })

      const identityMock: any = jest.mocked(Identity)
      identityMock.OdisUtils = {
        Identifier: {
          getObfuscatedIdentifier: () => ({ obfuscatedIdentifier: '' }),
          IdentifierPrefix: {},
        },
      }

      const authSigner = {} as any as AuthSigner
      const serviceContext = {} as any as ServiceContext

      const resolver = new ResolveCelo({
        providerUrl: 'http://does.not.matter',
        federatedAttestationsProxyContractAddress: '0x1',
        trustedIssuers: [],
        authSigner,
        account: '0x3',
        serviceContext,
      })

      const resolutions = await resolver.resolve('+18888888888')
      expect(resolutions.resolutions.length).toBe(0)
      expect(resolutions.errors.length).toBe(1)
    })

    it('returns errors on ODIS SDK error', async () => {
      const Web3Mock: any = jest.mocked(Web3)
      Web3Mock.mockImplementation(() => {
        return {
          eth: {
            Contract: jest.fn().mockImplementation(),
          },
        }
      })

      const identityMock: any = jest.mocked(Identity)
      identityMock.OdisUtils = {
        Identifier: {
          getObfuscatedIdentifier: () => {
            throw new Error('foo')
          },
          IdentifierPrefix: {},
        },
      }

      const authSigner = {} as any as AuthSigner
      const serviceContext = {} as any as ServiceContext

      const resolver = new ResolveCelo({
        providerUrl: 'http://does.not.matter',
        federatedAttestationsProxyContractAddress: '0x1',
        trustedIssuers: [],
        authSigner,
        account: '0x3',
        serviceContext,
      })

      const resolutions = await resolver.resolve('+18888888888')
      expect(resolutions.resolutions.length).toBe(0)
      expect(resolutions.errors.length).toBe(1)
    })
  })
})
