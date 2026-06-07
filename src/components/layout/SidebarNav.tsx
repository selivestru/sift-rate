'use client'

import { cn } from '@heroui/theme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '~/constants/navLinks'

const isActivePath = (pathname: string, href: string) => {
  return pathname === href || pathname.startsWith(`${href}/`)
}

interface NavLinksListProps {
  onNavigate?: () => void
}

const NavLinksList = ({ onNavigate }: NavLinksListProps) => {
  const pathname = usePathname()

  return (
    <>
      {NAV_LINKS.map(({ label, href, icon: Icon }) => {
        const isActive = isActivePath(pathname, href)

        return (
          <Link
            prefetch
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-xl px-4 py-3 transition-colors duration-300 lg:px-10',
              isActive
                ? 'bg-secondary/15 text-secondary'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
            )}>
            <Icon className='size-4.5 shrink-0' />
            <span className='truncate text-sm font-semibold'>{label}</span>
          </Link>
        )
      })}
    </>
  )
}

export const SidebarNav = () => {
  const pathname = usePathname()

  if (pathname.startsWith('/watch/')) {
    return
  }

  return (
    <aside className='sticky top-0 hidden h-fit pt-[calc(60px+10px+env(safe-area-inset-top))] lg:block'>
      <nav className='border-border bg-background-primary/60 flex flex-col gap-3 border border-t-transparent p-2 backdrop-blur-xl'>
        <NavLinksList />
      </nav>
    </aside>
  )
}

interface MobileSidebarNavProps {
  isOpen: boolean
  onClose: () => void
}

export const MobileSidebarNav = ({
  isOpen,
  onClose
}: MobileSidebarNavProps) => {
  return (
    <div
      className={cn(
        'fixed inset-0 z-40 lg:hidden',
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      )}>
      <button
        type='button'
        aria-label='Закрыть меню'
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-black/50 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
      />
      <aside
        className={cn(
          'border-r-border bg-background-primary/95 absolute top-[calc(62px+env(safe-area-inset-top))] left-0 h-[calc(100dvh-62px-env(safe-area-inset-top))] w-full border-r p-3 backdrop-blur-xl transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
        <nav className='flex flex-col gap-3'>
          <NavLinksList onNavigate={onClose} />
        </nav>
      </aside>
    </div>
  )
}
