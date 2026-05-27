import type { Metadata } from 'next'
import { PageTitle } from '~/components/ui/page-title'
import { buildSeoMetadata } from '~/lib/seo'
import { RatePage } from '~/screens/rate'

export const generateMetadata = (): Metadata =>
  buildSeoMetadata({
    title: 'Оценить',
    description:
      'Находите фильмы, сериалы, игры, книги и музыку, чтобы сохранять личные оценки и отзывы.',
    pathname: '/rate',
    keywords: [
      'оценить медиа',
      'создать отзыв',
      'поставить оценку',
      'поиск медиа'
    ]
  })

export default function Rate() {
  return (
    <>
      <PageTitle className='text-left'>Выберите категорию</PageTitle>
      <RatePage />
    </>
  )
}
