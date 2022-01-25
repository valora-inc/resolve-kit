import { ResolveAddress } from './resolve-address'

describe('resolve-address', () => {
  describe('ResolveAddress', () => {
    it('does not return resolutions for invalid address', async () => {
      const resolver = new ResolveAddress()
      const resolutions = await resolver.resolve('foo')

      expect(resolutions.resolutions.length).toBe(0)
      expect(resolutions.errors.length).toBe(0)
    })

    it('returns a resolution for valid address', async () => {
      const address = '0x1111111111111111111111111111111111111111'
      const resolver = new ResolveAddress()
      const resolutions = await resolver.resolve(address)

      expect(resolutions.resolutions.length).toBe(1)
      expect(resolutions.resolutions[0]).toStrictEqual({
        kind: 'address',
        address,
      })
      expect(resolutions.errors.length).toBe(0)
    })
  })
})
