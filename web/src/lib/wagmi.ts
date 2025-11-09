import { createConfig, http } from 'wagmi'
import { baseSepolia, mainnet } from 'wagmi/chains'

export const wagmiConfig = createConfig({
  chains: [mainnet, baseSepolia],
  transports: {
    [mainnet.id]: http('https://ethereum-rpc.publicnode.com'),
    [baseSepolia.id]: http('https://base-sepolia-rpc.publicnode.com'),
  },
})
