import { NomKit } from '@nomspace/nomspace'
import { ResolveNom } from './resolve-nom'

describe('resolve-nom', () => {
  describe('ResolveNom', () => {
    it('does not return resolutions for unmapped nom', async () => {
      const mockNomKit = {
        resolve: (_: string) => '0x0000000000000000000000000000000000000000',
      } as unknown as NomKit
      const resolver = new ResolveNom({ nomKit: mockNomKit })
      const resolutions = await resolver.resolve('foo')

      expect(resolutions.resolutions.length).toBe(0)
      expect(resolutions.errors.length).toBe(0)
    })

    it('does not return resolutions for invalid nom', async () => {
      const mockNomKit = {
        resolve: (_: string) => {
          throw new Error('should not happen')
        },
      } as unknown as NomKit
      const resolver = new ResolveNom({ nomKit: mockNomKit })
      const tooLongId = new Array(33).join('x')
      const resolutions = await resolver.resolve(tooLongId)

      expect(resolutions.resolutions.length).toBe(0)
      expect(resolutions.errors.length).toBe(0)
    })

    it('return resolutions for valid nom', async () => {
      const mockAddress = '0x1212121212121212121212121212121212121212'
      const mockNomKit = {
        resolve: (_: string) => mockAddress,
      } as unknown as NomKit
      const resolver = new ResolveNom({ nomKit: mockNomKit })
      const resolutions = await resolver.resolve('foo.nom')

      expect(resolutions.resolutions.length).toBe(1)
      expect(resolutions.errors.length).toBe(0)

      const resolution = resolutions.resolutions[0]
      expect(resolution.address).toBe(mockAddress)
      expect(resolution.name).toBe('foo')
    })

    it('does not return resolutions if domain does not end in ".nom"', async () => {
      const mockNomKit = {
        resolve: (_: string) => '0x1212121212121212121212121212121212121212',
      } as unknown as NomKit
      const resolver = new ResolveNom({ nomKit: mockNomKit })
      const resolutions = await resolver.resolve('foo')

      expect(resolutions.resolutions.length).toBe(0)
      expect(resolutions.errors.length).toBe(0)
    })

    it('returns errors', async () => {
      const mockNomKit = {
        resolve: (_: string) => {
          throw new Error('network error or something')
        },
      } as unknown as NomKit
      const resolver = new ResolveNom({ nomKit: mockNomKit })
      const resolutions = await resolver.resolve('foo.nom')

      expect(resolutions.resolutions.length).toBe(0)
      expect(resolutions.errors.length).toBe(1)
    })
  })
})
