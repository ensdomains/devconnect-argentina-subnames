import { useAccount as useAccountPara } from '@getpara/react-sdk'
import { useAccount as useAccountWagmi } from 'wagmi'

export function useAccount() {
  const paraAccount = useAccountPara()
  const account = useAccountWagmi()
  const isAuthed = !!paraAccount.embedded.auth

  return {
    ...account,
    isEmbedded: account.connector?.id === 'para',
    isAuthed,
  }
}
