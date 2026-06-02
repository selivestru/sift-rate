import { auth } from '~/server/auth'
import { LayoutShell } from './LayoutShell'
import { SeasonalEffect } from './SeasonalEffect'

export const Layout = async ({ children }: React.PropsWithChildren) => {
  const session = await auth()

  if (!session?.user) {
    return <>{children}</>
  }

  return (
    <>
      <SeasonalEffect />
      <LayoutShell email={session.user.email}>{children}</LayoutShell>
    </>
  )
}
