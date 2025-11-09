import { useQuery } from '@tanstack/react-query'

import { SessionData } from '@/app/api/auth/types'

export function useAuth() {
  return useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const response = await fetch('/api/auth')
      return response.json() as Promise<SessionData>
    },
  })
}
