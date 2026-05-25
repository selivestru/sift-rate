import type { Metadata } from 'next'
import { PageTitle } from '~/components/ui/page-title'
import { buildSeoMetadata } from '~/lib/seo'
import { RankingListPage } from '~/screens/ranking-list'

export const generateMetadata = (): Metadata =>
  buildSeoMetadata({
    title: 'Рейтинги',
    description:
      'Создавайте и редактируйте списки рейтинга, чтобы упорядочивать любимые фильмы, сериалы, игры, книги и музыку.',
    pathname: '/ranking-list',
    keywords: [
      'списки рейтинга',
      'личный рейтинг медиа',
      'сортировка любимого',
      'рейтинг фильмов и сериалов'
    ]
  })

export default function Rate() {
  return (
    <>
      <PageTitle>Рейтинги</PageTitle>
      <RankingListPage />
    </>
  )
}
