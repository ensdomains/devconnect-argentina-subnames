'use client'

import { Environment, ParaProvider } from '@getpara/react-sdk'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { chains, transports } from '@/lib/wagmi'

const queryClient = new QueryClient()

export function ClientProviders({ children }: React.PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <ParaProvider
        paraClientConfig={{
          apiKey: process.env.NEXT_PUBLIC_PARA_API_KEY!,
          env:
            process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ||
            process.env.NODE_ENV === 'production'
              ? Environment.PROD
              : Environment.DEV,
        }}
        externalWalletConfig={{
          wallets: [
            'RAINBOW',
            'METAMASK',
            'COINBASE',
            'PHANTOM',
            'WALLETCONNECT',
          ],
          evmConnector: {
            config: {
              chains,
              transports,
              ssr: true,
            },
          },
          walletConnect: {
            projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID || '',
          },
        }}
        config={{
          appName: 'ENS',
        }}
        paraModalConfig={{
          theme: {
            foregroundColor: '#011a25',
          },
          oAuthMethods: [],
          authLayout: ['AUTH:FULL', 'EXTERNAL:FULL'],
        }}
      >
        {children}
      </ParaProvider>
    </QueryClientProvider>
  )
}
