import { ResolveSocialConnect } from './resolve-social-connect'
import { AuthSigner, ServiceContext } from '@celo/identity/lib/odis/query'
import Web3 from 'web3'
import * as Identity from '@celo/identity'

jest.mock('web3')
jest.mock('@celo/identity')

describe('resolve-social-connect', () => {
  describe('ResolveSocialConnect', () => {
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
                      countsPerIssuer: ['1', '1'],
                      accounts: ['0xf00ba7', '0xdeadf00d'],
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

      const resolver = new ResolveSocialConnect({
        providerUrl: 'http://does.not.matter',
        federatedAttestationsProxyContractAddress: '0x1',
        trustedIssuers: {
          '0x1': 'unit-test-1',
          '0x2': 'unit-test-2',
        },
        authSigner,
        account: '0x3',
        serviceContext,
      })

      const resolutions = await resolver.resolve('+18888888888')
      expect(resolutions.resolutions.length).toBe(2)
      expect(resolutions.errors.length).toBe(0)
      expect(resolutions.resolutions).toEqual(
        expect.arrayContaining([
          {
            address: '0xf00ba7',
            issuerName: 'unit-test-1',
            kind: 'social-connect',
          },
          {
            address: '0xdeadf00d',
            issuerName: 'unit-test-2',
            kind: 'social-connect',
          },
        ]),
      )
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

      const resolver = new ResolveSocialConnect({
        providerUrl: 'http://does.not.matter',
        federatedAttestationsProxyContractAddress: '0x1',
        trustedIssuers: { '0x2': 'unit-test' },
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

      const resolver = new ResolveSocialConnect({
        providerUrl: 'http://does.not.matter',
        federatedAttestationsProxyContractAddress: '0x1',
        trustedIssuers: { '0x2': 'unit-test' },
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
