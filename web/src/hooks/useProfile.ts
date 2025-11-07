import { normalize } from 'viem/ens'

export async function getProfile(_label: string) {
  const label = normalize(_label)

  return {
    label,
    name: `${label}.worldfair.eth`,
    texts: {
      description: 'I like baking and building apps on web3 protocols.',
      avatar: 'https://ens-api.gregskril.com/avatar/gregskril.eth?width=256',
      url: 'https://gregskril.com',
      'com.twitter': 'gregskril',
      'com.github': 'gskril',
    } as Record<string, string>,
    addresses: {
      60: '0x179A862703a4adfb29896552DF9e307980D19285',
    } as Record<number, string>,
  }
}
