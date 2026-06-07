'use client'

import { cn } from '@heroui/theme'
import { usePathname } from 'next/navigation'

export const Main = ({ children }: React.PropsWithChildren) => {
  const pathname = usePathname()

  return (
    <main
      className={cn(
        'app-container z-px scrollbar-hide relative m-0! pt-[calc(62px+10px+env(safe-area-inset-top))] pb-[calc(69px+16px+env(safe-area-inset-bottom))] lg:pt-25 lg:pb-5',
        'flex flex-col',
        {
          'max-w-400!': pathname === '/wheel' || pathname.startsWith('/watch/')
        }
      )}>
      {children}
    </main>
  )
}
