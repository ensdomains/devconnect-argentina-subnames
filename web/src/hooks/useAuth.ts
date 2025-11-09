import { useQuery } from '@tanstack/react-query'

import { SessionData } from '@/app/api/auth/types'

export function useAuth() {
  return useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const response = await fetch('/api/auth')
      const json = (await response.json()) as SessionData

      if (!json.nullifierHashV4) {
        return { authed: false }
      }

      return {
        authed: true,
        nullifier: BigInt(json.nullifierHashV4),
      }
    },
  })
}
