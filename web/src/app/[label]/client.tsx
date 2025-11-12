'use client'

import { useLogout, useModal } from '@getpara/react-sdk'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { encodeFunctionData, namehash, toHex } from 'viem'
import { baseSepolia } from 'viem/chains'
import {
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'

import { Button } from '@/components/Button'
import { EnsRecord } from '@/components/EnsRecord'
import { Input } from '@/components/Input'
import { useAccount } from '@/hooks/useAccount'
import { Profile, useProfile } from '@/hooks/useProfile'
import { REGISTRY, RESOLVER_ABI } from '@/lib/contracts'
import {
  ALL_COIN_TYPES,
  GENERIC_TEXT_KEYS,
  GENERIC_TEXT_LABELS,
  SOCIAL_TEXT_KEYS,
  SOCIAL_TEXT_LABELS,
  getChainName,
} from '@/lib/records'
import { cn } from '@/lib/utils'

export function Client({ profile: _serverProfile }: { profile: Profile }) {
  const { address, isEmbedded } = useAccount()
  const { openModal } = useModal()
  const { logout: disconnectWallet } = useLogout()
  const { switchChain } = useSwitchChain()
  const [isEditMode, setIsEditMode] = useState(false)
  const tx = useWriteContract()
  const receipt = useWaitForTransactionReceipt({ hash: tx.data })

  // Profile should default to the server profile but get updated in real time
  const { data: _clientProfile, refetch: refetchProfile } = useProfile(
    _serverProfile.label
  )
  const profile = _clientProfile ?? _serverProfile

  // Exit editing mode after a successful transaction
  useEffect(() => {
    if (receipt.isSuccess) {
      refetchProfile()
      setIsEditMode(false)
      toast.success('Profile updated')
    }
  }, [receipt.isSuccess])

  // TODO: Jump straight into edit mode if the user is the owner and they come straight from registration
  // Then remove the query param
  useEffect(() => {}, [])

  async function handleSaveEdits(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    // Create array of changed texts
    const texts = Array.from(formData.entries())
      .filter(([key]) => key.startsWith('text:'))
      .map(([key, value]) => ({
        key: key.replace('text:', ''),
        value: value as string,
      }))
      .filter(({ key, value }) => (profile.texts?.[key] ?? '') !== value)

    // Create array of changed addresses
    const addresses = Array.from(formData.entries())
      .filter(([key]) => key.startsWith('address:'))
      .map(([key, value]) => ({
        key: key.replace('address:', ''),
        value: value as string,
      }))
      .filter(({ key, value }) => (profile.addresses?.[key] ?? '') !== value)

    const setTextCalls = texts.map(({ key, value }) =>
      encodeFunctionData({
        abi: RESOLVER_ABI,
        functionName: 'setText',
        args: [namehash(profile.name), key, value],
      })
    )

    const setAddrCalls = addresses.map(({ key, value }) =>
      encodeFunctionData({
        abi: RESOLVER_ABI,
        functionName: 'setAddr',
        args: [namehash(profile.name), BigInt(key), toHex(value)],
      })
    )

    if (!setTextCalls.length && !setAddrCalls.length) {
      setIsEditMode(false)
      return
    }

    switchChain({ chainId: baseSepolia.id })

    await tx.writeContractAsync({
      ...REGISTRY,
      functionName: 'multicall',
      args: [[...setTextCalls, ...setAddrCalls]],
      chainId: baseSepolia.id,
    })
  }

  return (
    <>
      <main className="bg-brand-dust flex flex-1 flex-col gap-y-6 px-4 py-6">
        <div className="flex items-center gap-x-4">
          {profile.texts?.['avatar'] ? (
            <img
              src={profile.texts?.['avatar']}
              alt={profile.label}
              className="h-24 w-24 rounded-full"
              width={96}
              height={96}
            />
          ) : (
            <div className="from-brand-blue-light to-brand-blue h-24 w-24 rounded-full bg-linear-to-tl" />
          )}

          <div className="text-brand-lapise-dense flex flex-col gap-y-2">
            <span className="text-brand-blue font-mono text-xs font-medium uppercase">
              ENS Quest Completed!
            </span>
            <h1 className="text-2xl">{profile.name}</h1>
          </div>
        </div>

        {(() => {
          if (isEditMode) {
            return (
              <>
                <form
                  onSubmit={handleSaveEdits}
                  id="edit-profile"
                  className="flex flex-col gap-y-1"
                >
                  {[...GENERIC_TEXT_KEYS, ...SOCIAL_TEXT_KEYS].map((key) => (
                    <Input
                      key={key}
                      name={`text:${key}`}
                      defaultValue={profile.texts[key]}
                      label={
                        GENERIC_TEXT_LABELS.get(key)?.label ??
                        SOCIAL_TEXT_LABELS.get(key)?.label ??
                        key
                      }
                      placeholder={
                        GENERIC_TEXT_LABELS.get(key)?.placeholder ??
                        SOCIAL_TEXT_LABELS.get(key)?.placeholder ??
                        ''
                      }
                    />
                  ))}

                  {ALL_COIN_TYPES.map((cointype) => (
                    <Input
                      key={cointype}
                      name={`address:${cointype}`}
                      defaultValue={profile.addresses[cointype.toString()]}
                      label={getChainName(cointype)}
                    />
                  ))}
                </form>
              </>
            )
          }

          return (
            <>
              <EnsRecord
                type="text"
                label="Description"
                value={profile.texts.description}
                className="col-span-2"
              />

              <EnsRecord
                type="text"
                label="Website"
                value={profile.texts.url}
                className="col-span-2"
              />

              {/* Addresses */}
              <div>
                <SectionLabel label="Addresses" />
                <div className="flex flex-col gap-y-2">
                  {Object.entries(profile.addresses).map(
                    ([cointype, address]) => (
                      <EnsRecord
                        key={cointype}
                        type="address"
                        cointype={parseInt(cointype)}
                        value={address}
                      />
                    )
                  )}
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
            </>
          )
        })()}
      </main>

      <div className="grid grid-cols-2 gap-x-4 p-4">
        {(() => {
          if (address && address === profile.owner) {
            // Show edit button
            return (
              <>
                <ActionButton>
                  {isEditMode ? (
                    <Button
                      className="uppercase"
                      size="large"
                      type="submit"
                      form="edit-profile"
                    >
                      {(() => {
                        if (tx.isPending) {
                          if (isEmbedded) {
                            return 'Saving...'
                          }

                          return 'Confirm in wallet'
                        }

                        if (tx.data && !receipt.isSuccess) {
                          return 'Saving...'
                        }

                        return 'Save'
                      })()}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="large"
                      className="uppercase"
                      onClick={(e) => {
                        e.preventDefault()
                        setIsEditMode(true)
                      }}
                    >
                      Edit
                    </Button>
                  )}
                </ActionButton>
                <ActionButton>
                  <Button
                    size="large"
                    type="button"
                    className="uppercase"
                    variant="secondary"
                    onClick={() => disconnectWallet()}
                  >
                    Disconnect
                  </Button>
                </ActionButton>
              </>
            )
          }

          if (!address || address !== profile.owner) {
            return (
              <>
                <ActionButton
                  description={
                    address ? undefined : 'Don’t have a devconnect subname yet?'
                  }
                >
                  <Button size="large" className="uppercase" asChild>
                    <Link href="/">Get your own</Link>
                  </Button>
                </ActionButton>

                <ActionButton
                  description={
                    address
                      ? undefined
                      : 'Own this name and want to make changes?'
                  }
                >
                  <Button
                    size="large"
                    type="button"
                    className="uppercase"
                    variant="secondary"
                    onClick={() => {
                      if (!address) {
                        openModal()
                      } else {
                        disconnectWallet()
                      }
                    }}
                  >
                    {address ? 'Disconnect' : 'Connect'}
                  </Button>
                </ActionButton>
              </>
            )
          }
        })()}
      </div>
    </>
  )
}

function SectionLabel({ label }: { label: string }) {
  return (
    <span className="text-brand-grey mb-1 block w-full text-xs font-medium lowercase">
      {label}
    </span>
  )
}

function ActionButton({
  span,
  children,
  description,
}: React.PropsWithChildren<{ span?: number; description?: string }>) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-y-2',
        span && `col-span-${span}`
      )}
    >
      {children}
      {description && (
        <p className="text-brand-lapise-dense text-sm">{description}</p>
      )}
    </div>
  )
}
