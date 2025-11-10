// These will all be set at registration time
export const EVM_COIN_TYPES = [
  BigInt(60), // ETH
  BigInt(2147492101), // Base
  BigInt(2147483658), // Optimism
  BigInt(2147525809), // Arbitrum
  BigInt(2148018000), // Scroll
  BigInt(2147542792), // Linea
  BigInt(2147525868), // Celo
]

// These will all be fetched for the profile page
export const ALL_COIN_TYPES = [
  ...EVM_COIN_TYPES,
  BigInt(0), // BTC
  BigInt(501), // SOL
]

// These will be displayed on the profile and available for editing
export const GENERIC_TEXT_KEYS = ['description', 'url']

export const SOCIAL_TEXT_KEYS = [
  'com.twitter',
  'com.github',
  'org.telegram',
  // 'eth.farcaster',
]
