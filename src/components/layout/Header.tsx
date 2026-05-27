'use client'

import { Button } from '@heroui/button'
import { LogOutIcon, MenuIcon, UserIcon, XIcon } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { ROUTES } from '~/constants/routes'
import { Show } from '../ui/show'

interface IHeaderProps {
  email: string | null | undefined
  isMobileNavOpen: boolean
  onToggleMobileNav: () => void
}

export const Header = ({
  email,
  isMobileNavOpen,
  onToggleMobileNav
}: IHeaderProps) => {
  const handleSignOut = async () => {
    await signOut({
      redirectTo: ROUTES.HOME
    })
  }

  return (
    <header className='border-b-border bg-background-primary/60 pt-safe-or-4 fixed top-0 z-50 h-17.5 w-full border-b pb-4 backdrop-blur-xl'>
      <div className='app-container flex h-full items-center justify-between gap-4'>
        <Button
          isIconOnly
          variant='flat'
          className='lg:hidden'
          onPress={onToggleMobileNav}>
          {isMobileNavOpen ? (
            <XIcon className='size-5' />
          ) : (
            <MenuIcon className='size-5' />
          )}
        </Button>
        <Link
          prefetch
          href={ROUTES.REVIEWS}
          className='flex min-w-0 shrink items-center gap-2 lg:shrink-0'>
          <div className='bg-secondary-400 flex size-8 items-center justify-center rounded-lg'>
            <span className='text-primary-foreground text-lg font-bold'>S</span>
          </div>
          <span className='text-foreground font-roboto-slab truncate text-xl font-bold'>
            Sift-Rate
          </span>
        </Link>
        <div className='flex shrink-0 items-center gap-2'>
          <Show when={!!email}>
            <div className='hidden items-center gap-2 lg:flex'>
              <UserIcon className='size-5' />
              <span className='text-sm'>{email}</span>
            </div>
          </Show>
          <Button
            isIconOnly
            type='submit'
            variant='flat'
            onPress={handleSignOut}>
            <LogOutIcon className='size-5' />
          </Button>
        </div>
      </div>
    </header>
  )
}
