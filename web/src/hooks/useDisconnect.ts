import { useLogout } from '@getpara/react-sdk'
import { useDisconnect as useDisconnectWagmi } from 'wagmi'

export function useDisconnect() {
  const { logout: _logout } = useLogout()
  const { disconnect: _disconnect } = useDisconnectWagmi()

  function disconnect() {
    _disconnect()
    _logout()
  }

  return disconnect
}
