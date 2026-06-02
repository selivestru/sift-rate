import { type AxiosError } from 'axios'
import { useState } from 'react'
import { SearchService, type ITargetItem } from '~/components/features/rating'
import type { ContentType } from '~/generated/prisma'

const WISHLIST_SEARCH_LIMIT = 5

export const useWishlistSearch = (selectedType: ContentType) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [result, setResult] = useState<ITargetItem[] | null | undefined>(null)
  const [error, setError] = useState<string | null>(null)
  const isLoading = typeof result === 'undefined'

  const searchTargets = async () => {
    if (isLoading) return

    if (searchTerm.trim().length === 0) {
      setResult(null)
      return
    }

    const searchService = new SearchService()

    setError(null)
    setResult(undefined)

    try {
      const response = await searchService.search(selectedType, searchTerm, 1)

      setResult(response.items.slice(0, WISHLIST_SEARCH_LIMIT))
    } catch (error) {
      console.error(
        `Error searching wishlist entity with selectedType ${selectedType}: `,
        error
      )

      setError((error as AxiosError)?.message ?? 'Произошла ошибка')
      setResult(null)
    }
  }

  const clearSearch = () => {
    setSearchTerm('')
    setResult(null)
    setError(null)
  }

  return {
    searchTerm,
    setSearchTerm,
    result,
    isLoading,
    searchTargets,
    clearSearch,
    error
  }
}
