import { createConfig, http } from 'wagmi'
import { base, mainnet } from 'wagmi/chains'

export const chains = [mainnet, base] as const

export const transports = {
  [mainnet.id]: http('https://ethereum-rpc.publicnode.com'),
  [base.id]: http('https://base-rpc.publicnode.com'),
}

export const wagmiConfig = createConfig({
  chains,
  transports,
})
