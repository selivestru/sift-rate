import type { Metadata } from 'next'
import { PageTitle } from '~/components/ui/page-title'
import { buildSeoMetadata } from '~/lib/seo'
import { WishlistPage } from '~/screens/wishlist'

export const generateMetadata = (): Metadata =>
  buildSeoMetadata({
    title: 'Ожидания',
    description:
      'Сохраняйте фильмы, сериалы, игры, книги и музыку, которые хотите посмотреть, пройти, прочитать или послушать позже.',
    pathname: '/wishlist',
    keywords: [
      'список ожиданий',
      'посмотреть позже',
      'прочитать позже',
      'поиграть позже',
      'послушать позже'
    ]
  })

export default function Wishlist() {
  return (
    <>
      <PageTitle>Ожидания</PageTitle>
      <WishlistPage />
    </>
  )
}
