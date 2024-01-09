import { ViemClient, ResolveEns } from './resolve-ens'

describe('resolve-ens', () => {
  describe('ResolveEns', () => {
    it('does not return resolutions for non .eth', async () => {
      const mockViem = {
        getEnsAddress: (_: any) => null,
      } as unknown as ViemClient
      const resolver = new ResolveEns({ viem: mockViem })
      const resolutions = await resolver.resolve('foo')

      expect(resolutions.resolutions.length).toBe(0)
      expect(resolutions.errors.length).toBe(0)
    })

    it('does not return resolutions for unmapped .eth', async () => {
      const mockViem = {
        getEnsAddress: (_: any) => null,
      } as unknown as ViemClient
      const resolver = new ResolveEns({ viem: mockViem })
      const resolutions = await resolver.resolve('foo.eth')

      expect(resolutions.resolutions.length).toBe(0)
      expect(resolutions.errors.length).toBe(0)
    })

    it('return resolutions for mapped .eth', async () => {
      const mockAddress = '0x1212121212121212121212121212121212121212'
      const mockViem = {
        getEnsAddress: ({ coinType }: { coinType: number }) => {
          if (coinType === 60) {
            return mockAddress
          }
          return null
        },
      } as unknown as ViemClient
      const resolver = new ResolveEns({ viem: mockViem })
      const resolutions = await resolver.resolve('foo.eth')

      expect(resolutions.resolutions.length).toBe(1)
      expect(resolutions.errors.length).toBe(0)

      const resolution = resolutions.resolutions[0]
      expect(resolution.address).toBe(mockAddress)
    })

    it('returns an error for multiple different .eth resolutions', async () => {
      const mockAddress = '0x1212121212121212121212121212121212121212'
      const mockViem = {
        getEnsAddress: ({ coinType }: { coinType: number }) => {
          if (coinType === 60) {
            return mockAddress
          }
          return '0x3333333333333333333333333333333333333333'
        },
      } as unknown as ViemClient
      const resolver = new ResolveEns({ viem: mockViem })
      const resolutions = await resolver.resolve('foo.eth')

      expect(resolutions.resolutions.length).toBe(0)
      expect(resolutions.errors.length).toBe(1)
    })

    it('returns resolutions for multiple identical .eth resolutions', async () => {
      const mockAddress = '0x1212121212121212121212121212121212121212'
      const mockViem = {
        getEnsAddress: (_: any) => {
          return mockAddress
        },
      } as unknown as ViemClient
      const resolver = new ResolveEns({ viem: mockViem })
      const resolutions = await resolver.resolve('foo.eth')

      expect(resolutions.resolutions.length).toBe(1)
      expect(resolutions.errors.length).toBe(0)
      const resolution = resolutions.resolutions[0]
      expect(resolution.address).toBe(mockAddress)
    })

    it('does not return resolution if not ethereum', async () => {
      const mockAddress = '0x1212121212121212121212121212121212121212'
      const mockViem = {
        getEnsAddress: ({ coinType }: { coinType: number }) => {
          if (coinType === 60) {
            return null
          }
          return mockAddress
        },
      } as unknown as ViemClient
      const resolver = new ResolveEns({ viem: mockViem })
      const resolutions = await resolver.resolve('foo.eth')

      expect(resolutions.resolutions.length).toBe(0)
      expect(resolutions.errors.length).toBe(0)
    })
  })
})
