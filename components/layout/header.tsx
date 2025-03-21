import Link from "next/link"

import { siteConfig } from "@/config/site"

import { Icons } from "@/components/shared/icons"
import { ModeToggle } from "@/components/shared/mode-toggle"

export function Header() {
  return (
    <header className="bg-background sticky top-0 z-10 border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Link href="/" className="flex items-center text-xl font-bold">
            <Icons.calendar className="text-primary mr-2 size-5" />
            Event Duration Calculator
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icons.github className="size-5" />
          </Link>
        </div>
      </div>
    </header>
  )
}
