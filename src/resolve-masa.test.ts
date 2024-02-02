import { ResolveMasa } from './resolve-masa'
import { Masa } from '@masa-finance/masa-sdk'
import { VoidSigner, constants, providers } from 'ethers'

jest.mock('@masa-finance/masa-sdk')

describe('masa', () => {
  describe('ResolveMasa', () => {
    const MasaMock: any = jest.mocked(Masa)

    MasaMock.mockImplementation(() => ({
      soulName: {
        resolve: (soulName: string): Promise<string> =>
          new Promise((resolve) => {
            switch (soulName) {
              case '_test_':
                return resolve('')
              case 'test':
                return resolve('0x8ba2D360323e3cA85b94c6F7720B70aAc8D37a7a')
              case 't89e3786oaruhmazj7r453iwqb6g7uac':
                return resolve('')
            }
          }),
      },
      contracts: {
        instances: {
          SoulNameContract: {
            extension: (): Promise<string> =>
              new Promise((resolve) => resolve('.celo')),
          },
        },
      },
    }))

    const masa = new Masa({
      signer: new VoidSigner(
        constants.AddressZero,
        new providers.JsonRpcProvider(),
      ),
      networkName: 'alfajores',
    })

    const resolver = new ResolveMasa({ masa })

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
  })
})
