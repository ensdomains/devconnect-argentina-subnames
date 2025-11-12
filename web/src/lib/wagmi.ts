import { createConfig, http } from 'wagmi'
import { baseSepolia, mainnet, sepolia } from 'wagmi/chains'

export const chains = [mainnet, baseSepolia, sepolia] as const

export const wagmiConfig = createConfig({
  chains,
  transports: {
    [mainnet.id]: http('https://ethereum-rpc.publicnode.com'),
    [baseSepolia.id]: http('https://base-sepolia-rpc.publicnode.com'),
    [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
  },
})
