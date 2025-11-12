import { useAccount as useAccountPara } from '@getpara/react-sdk'
import { useAccount as useAccountWagmi } from 'wagmi'

export function useAccount() {
  const { embedded } = useAccountPara()
  const account = useAccountWagmi()

  return {
    ...account,
    isEmbedded: embedded.isConnected,
  }
}
