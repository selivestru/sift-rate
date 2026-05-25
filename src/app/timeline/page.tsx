import type { Metadata } from 'next'
import { PageTitle } from '~/components/ui/page-title'
import { TimelineProvider } from '~/contexts/TimelineProvider'
import { buildSeoMetadata } from '~/lib/seo'
import { TimelinePage } from '~/screens/timeline'

export const generateMetadata = (): Metadata =>
  buildSeoMetadata({
    title: 'Лента активности',
    description:
      'Отслеживайте активность по отзывам и оценкам в хронологической ленте.',
    pathname: '/timeline',
    keywords: ['лента активности', 'лента отзывов', 'лента оценок']
  })

export default function Timeline() {
  return (
    <TimelineProvider>
      <PageTitle>Лента активности</PageTitle>
      <TimelinePage />
    </TimelineProvider>
  )
}
