import { createConfig, http } from 'wagmi'
import { baseSepolia, mainnet } from 'wagmi/chains'

export const wagmiConfig = createConfig({
  chains: [mainnet, baseSepolia],
  transports: {
    [mainnet.id]: http(),
    [baseSepolia.id]: http(),
  },
})
