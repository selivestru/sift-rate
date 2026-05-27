'use client'

import type { ContentType } from '~/generated/prisma'
import { SelectTarget } from './components/SelectTarget'

interface IRateCategoryPageProps {
  category: ContentType
}

export const RateCategoryPage = ({ category }: IRateCategoryPageProps) => {
  return <SelectTarget category={category} />
}
