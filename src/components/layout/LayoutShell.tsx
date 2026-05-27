'use client'

import { useEffect, useState } from 'react'
import { Header } from './Header'
import { Main } from './Main'
import { MobileSidebarNav, SidebarNav } from './SidebarNav'

interface LayoutShellProps {
  children: React.ReactNode
  email: string | null | undefined
}

export const LayoutShell = ({ children, email }: LayoutShellProps) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileNavOpen])

  return (
    <div className='relative flex min-h-dvh flex-col'>
      <Header
        email={email}
        isMobileNavOpen={isMobileNavOpen}
        onToggleMobileNav={() => setIsMobileNavOpen((prev) => !prev)}
      />
      <MobileSidebarNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
      <div className='grid flex-1 gap-4 lg:grid-cols-[auto_1fr]'>
        <SidebarNav />
        <Main>{children}</Main>
      </div>
    </div>
  )
}
