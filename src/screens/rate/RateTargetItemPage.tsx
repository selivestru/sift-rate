import { notFound } from 'next/navigation'
import { use } from 'react'
import { SearchService } from '~/components/features/rating'
import type { ContentType } from '~/generated/prisma'
import { SubmitRating } from './components/SubmitRating'

interface IRateTargetItemPageProps {
  id: string
  category: ContentType
}

export const RateTargetItemPage = ({
  id,
  category
}: IRateTargetItemPageProps) => {
  const searchService = new SearchService()

  const targetItem = use(searchService.searchById(category, id))

  if (!targetItem) {
    notFound()
  }

  return <SubmitRating targetItem={targetItem} />
}
