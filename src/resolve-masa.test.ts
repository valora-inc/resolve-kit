import { ResolveMasa } from './resolve-masa'
import { Masa } from '@masa-finance/masa-sdk'
import { providers } from 'ethers'

const providerUrl = 'https://alfajores-forno.celo-testnet.org'

describe('masa', () => {
  describe('ResolveMasa', () => {
    const resolver = new ResolveMasa({
      providerUrl,
      networkName: 'alfajores',
    })

    it('should return an address for a valid name', async () => {
      const resolutions = await resolver.resolve('test.celo')

      expect(resolutions.resolutions.length).toBe(1)
      expect(resolutions.errors.length).toBe(0)

      const resolution = resolutions.resolutions[0]
      expect(resolution.address).toBe(
        '0x8ba2D360323e3cA85b94c6F7720B70aAc8D37a7a',
      )
      expect(resolution.name).toBe('test')
    })

    it('should return nothing for a name with invalid ending', async () => {
      const resolutions = await resolver.resolve('test.cole')

      expect(resolutions.resolutions.length).toBe(0)
      expect(resolutions.errors.length).toBe(0)
    })

    it('should return nothing for an invalid name', async () => {
      const resolutions = await resolver.resolve('_test_.celo')

      expect(resolutions.resolutions.length).toBe(0)
      expect(resolutions.errors.length).toBe(0)
    })

    it('should return nothing for unknown name', async () => {
      const resolutions = await resolver.resolve(
        't89e3786oaruhmazj7r453iwqb6g7uac.celo',
      )

      expect(resolutions.resolutions.length).toBe(0)
      expect(resolutions.errors.length).toBe(0)
    })

    it('should fail if misconfigured', async () => {
      const newResolver = new ResolveMasa({
        masa: new Masa({
          wallet: new providers.JsonRpcProvider(providerUrl).getSigner(),
          // wrong network
          networkName: 'ethereum',
        }),
      })
      const resolutions = await newResolver.resolve('test.celo')

      expect(resolutions.resolutions.length).toBe(0)
      expect(resolutions.errors.length).toBe(1)
    })
  })
})
