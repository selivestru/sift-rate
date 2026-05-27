'use client'

import dynamic from 'next/dynamic'
import { LoadingSpinner } from '~/components/ui/loading-spinner'

const WheelPageContent = dynamic(
  () => import('./WheelPageContent').then((mod) => mod.WheelPageContent),
  { ssr: false, loading: () => <LoadingSpinner /> }
)

export const WheelPage = () => {
  return <WheelPageContent />
}
