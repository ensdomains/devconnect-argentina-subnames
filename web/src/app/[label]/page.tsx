import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { getProfile } from '@/hooks/useProfile'

import { Client } from './client'

export default async function Page({
  params,
}: {
  params: Promise<{ label: string }>
}) {
  const { label: _label } = await params
  const profile = await getProfile(_label)

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <Client profile={profile} />
      <Footer />
    </div>
  )
}
