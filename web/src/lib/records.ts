import { getCoderByCoinType } from '@ensdomains/address-encoder'

// These will all be set at registration time
export const CHAIN_MAP = new Map<bigint, string>([
  [BigInt(60), 'Ethereum'],
  [BigInt(2147492101), 'Base'],
  [BigInt(2147483658), 'OP Mainnet'],
  [BigInt(2147525809), 'Arbitrum'],
  [BigInt(2148018000), 'Scroll'],
  [BigInt(2147542792), 'Linea'],
  [BigInt(2147525868), 'Celo'],
])

export const EVM_COIN_TYPES = Array.from(CHAIN_MAP.keys())

export function getChainName(cointype: bigint) {
  return (
    CHAIN_MAP.get(cointype) ||
    getCoderByCoinType(Number(cointype)).name ||
    `Chain ${cointype}`
  )
}

// These will all be fetched for the profile page
export const ALL_COIN_TYPES = [
  ...EVM_COIN_TYPES,
  // BigInt(0), // BTC
  // BigInt(501), // SOL
]

// These will be displayed on the profile and available for editing
export const GENERIC_TEXT_LABELS = new Map<
  string,
  { label: string; placeholder: string }
>([
  ['description', { label: 'Description', placeholder: 'I like ...' }],
  ['url', { label: 'Website', placeholder: 'https://example.com' }],
])

export const GENERIC_TEXT_KEYS = Array.from(GENERIC_TEXT_LABELS.keys())

export const SOCIAL_TEXT_LABELS = new Map<
  string,
  { label: string; placeholder: string }
>([
  ['com.twitter', { label: 'X / Twitter', placeholder: 'ensdomains' }],
  ['com.github', { label: 'GitHub', placeholder: 'ensdomains' }],
  ['org.telegram', { label: 'Telegram', placeholder: 'ensdomains' }],
  ['eth.farcaster', { label: 'Farcaster', placeholder: 'ensdomains' }],
])

export const SOCIAL_TEXT_KEYS = Array.from(SOCIAL_TEXT_LABELS.keys())
