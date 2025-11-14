import { createConfig, http } from 'wagmi'
import { base, mainnet } from 'wagmi/chains'

export const chains = [mainnet, base] as const

export const transports = {
  [mainnet.id]: http(
    process.env.NEXT_PUBLIC_ETH_RPC_URL || 'https://ethereum-rpc.publicnode.com'
  ),
  [base.id]: http(
    process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://base-rpc.publicnode.com'
  ),
}

export const wagmiConfig = createConfig({
  chains,
  transports,
})
