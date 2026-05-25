import type { Metadata } from 'next'
import { PageTitle } from '~/components/ui/page-title'
import { buildSeoMetadata } from '~/lib/seo'
import { ReviewsPage } from '~/screens/reviews'

export const generateMetadata = (): Metadata =>
  buildSeoMetadata({
    title: 'Отзывы',
    description:
      'Просматривайте полную историю сохраненных оценок и написанных отзывов.',
    pathname: '/reviews',
    keywords: ['история отзывов', 'история оценок', 'сохраненные отзывы']
  })

export default function Reviews() {
  return (
    <>
      <PageTitle>История впечатлений</PageTitle>
      <ReviewsPage />
    </>
  )
}
