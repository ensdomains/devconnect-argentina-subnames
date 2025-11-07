import { createConfig, http } from 'wagmi'
import { base, mainnet } from 'wagmi/chains'

export const wagmiConfig = createConfig({
  chains: [mainnet, base],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
})
