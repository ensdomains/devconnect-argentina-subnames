import Image from 'next/image'

const links = new Map<string, string>([
  ['Blog', 'https://ens.domains/blog'],
  ['Discord', 'https://chat.ens.domains/'],
  ['Twitter', 'https://x.com/ensdomains'],
  ['GitHub', 'https://github.com/ensdomains'],
  ['YouTube', 'https://www.youtube.com/@ensdomains'],
  ['DAO Forum', 'https://discuss.ens.domains/'],
])

export function Footer() {
  return (
    <footer className="bg-brand-blue-dark text-brand-blue-light p-4">
      <div className="border-brand-blue-light flex flex-col gap-y-6 border-t pt-2">
        <span>Join the community</span>

        <div className="flex flex-col gap-y-4">
          {Array.from(links.entries()).map(([label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex justify-between gap-x-4">
          <span>ENS, Copyright, 2024. All Rights Reserved.</span>
          <Image src="/img/ens-mark.svg" alt="ENS" width={100} height={100} />
        </div>
      </div>
    </footer>
  )
}
