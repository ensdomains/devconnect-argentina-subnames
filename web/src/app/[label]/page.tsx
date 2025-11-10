import { EnsRecord } from '@/components/EnsRecord'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { getProfile } from '@/hooks/useProfile'
import { SOCIAL_TEXT_KEYS } from '@/lib/records'

export default async function Page({
  params,
}: {
  params: Promise<{ label: string }>
}) {
  const { label: _label } = await params
  const profile = await getProfile(_label)
  const addresses = Object.entries(profile.addresses)
  const texts = Object.entries(profile.texts)

  return (
    <div className="flex min-h-screen flex-col">
      <Nav />

      <main className="bg-brand-blue-light flex flex-1 flex-col gap-y-6 px-4 py-6">
        <div className="flex items-center gap-x-4">
          {profile.texts?.['avatar'] && (
            <img
              src={profile.texts?.['avatar']}
              alt={profile.label}
              className="h-24 w-24 rounded-full"
              width={96}
              height={96}
            />
          )}
          <div className="text-brand-lapise-dense flex flex-col gap-y-2">
            <span className="font-mono text-xs font-medium uppercase">
              ENS Quest Completed!
            </span>
            <h1 className="text-2xl">{profile.name}</h1>
          </div>
        </div>

        <EnsRecord
          type="text"
          label="Description"
          value={profile.texts.description}
          className="col-span-2"
        />

        {/* Addresses */}
        <div>
          <SectionLabel label="Addresses" />
          <div className="flex flex-col gap-y-2">
            {addresses.map(([cointype, address]) => (
              <EnsRecord
                key={cointype}
                type="address"
                cointype={parseInt(cointype)}
                value={address}
              />
            ))}
          </div>
        </div>

        {/* Socials */}
        {SOCIAL_TEXT_KEYS.some((key) => !!profile.texts[key]) && (
          <div>
            <SectionLabel label="Socials" />
            <div className="flex w-full flex-wrap gap-x-4">
              {SOCIAL_TEXT_KEYS.map((key) => (
                <EnsRecord
                  key={key}
                  type="social"
                  label={key}
                  value={profile.texts[key]}
                />
              ))}
            </div>
          </div>
        )}
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
