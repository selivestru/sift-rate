import { env } from '~/env'
import { auth } from '~/server/auth'
import { Show } from '../ui/show'
import { LayoutShell } from './LayoutShell'
import { SeasonalEffect } from './SeasonalEffect'

export const Layout = async ({ children }: React.PropsWithChildren) => {
  const session = await auth()

  if (!session?.user) {
    return <>{children}</>
  }

  return (
    <>
      <Show when={env.NODE_ENV !== 'development'}>
        <SeasonalEffect />
      </Show>
      <LayoutShell email={session.user.email}>{children}</LayoutShell>
    </>
  )
}
