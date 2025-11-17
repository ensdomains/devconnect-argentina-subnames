import { useAccount as useAccountWagmi } from 'wagmi'

export function useAccount() {
  const account = useAccountWagmi()

  return {
    ...account,
    isEmbedded: account.connector?.id === 'para',
  }
}
