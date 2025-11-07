import { EnsRecord } from '@/components/EnsRecord'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { getProfile } from '@/hooks/useProfile'
import { cn } from '@/lib/utils'

export default async function Page({ params }: { params: { label: string } }) {
  const { label: _label } = params
  const profile = await getProfile(_label)

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />

      <main className="bg-brand-blue-light flex flex-1 flex-col gap-y-6 px-4 py-6">
        <div className="flex items-center gap-x-4">
          <img
            src={profile.texts.avatar}
            alt={profile.label}
            className="h-24 w-24 rounded-full"
            width={96}
            height={96}
          />
          <div className="text-brand-lapise-dense flex flex-col gap-y-2">
            <span className="font-mono text-xs font-medium uppercase">
              ENS Quest Completed!
            </span>
            <h1 className="text-2xl">{profile.name}</h1>
          </div>
        </div>

        {/* Longer records */}
        <div className="grid grid-cols-2 gap-6">
          <EnsRecord
            type="text"
            label="Twitter"
            value={profile.texts['com.twitter']}
          />
          <EnsRecord type="text" label="Website" value={profile.texts['url']} />
          <EnsRecord
            type="text"
            label="Description"
            value={profile.texts.description}
            className="col-span-2"
          />
        </div>

        {/* Addresses */}
        <div>
          <SectionLabel label="Addresses" />
          <div className="flex flex-wrap">
            <EnsRecord
              type="address"
              cointype={60}
              value={profile.addresses[60]}
            />
          </div>
        </div>

        {/* Socials */}
        <div>
          <SectionLabel label="Socials" />
          <div className="flex w-full flex-wrap gap-x-4">
            <EnsRecord
              type="social"
              label="com.twitter"
              value={profile.texts['com.twitter']}
            />
            <EnsRecord
              type="social"
              label="com.github"
              value={profile.texts['com.github']}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function SectionLabel({ label }: { label: string }) {
  return (
    <span className="text-brand-grey mb-1 block w-full text-xs font-medium lowercase">
      {label}
    </span>
  )
}
