import { type AxiosError } from 'axios'
import { useState } from 'react'
import { SearchService, type ITargetItem } from '~/components/features/rating'
import type { ContentType } from '~/generated/prisma'

export const useTargetSearch = (selectedType: ContentType) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [result, setResult] = useState<ITargetItem[] | null | undefined>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const isLoading = typeof result === 'undefined'

  const searchTargets = async (page = 1) => {
    if (isLoading) return

    if (searchTerm.trim().length === 0) {
      setResult(null)
      return
    }

    const searchService = new SearchService()

    setError(null)
    setResult(undefined)

    try {
      const response = await searchService.search(
        selectedType,
        searchTerm.trim(),
        page
      )

      setResult(response.items)
      setTotalPages(response.totalPages)
      setTotalResults(response.totalResults)
    } catch (error) {
      console.error(
        `Error searching entity with selectedType ${selectedType}: `,
        error
      )

      setError((error as AxiosError)?.message ?? 'Произошла ошибка')

      setResult(null)
    }
  }

  const clearSearch = () => {
    setSearchTerm('')
    setResult(null)
    setCurrentPage(1)
    setTotalPages(1)
    setTotalResults(0)
  }

  const onChangePage = (page: number) => {
    setCurrentPage(page)
    void searchTargets(page)
  }

  const handleChangeSearchTerm = (value: string) => {
    setSearchTerm(value)

    const trimmedValue = value.trim()

    const url = new URL(window.location.href)
    url.searchParams.set('q', trimmedValue)

    if (!trimmedValue.length) {
      url.searchParams.delete('q')
    }

    window.history.replaceState({}, '', url)
  }

  return {
    searchTerm,
    changeSearchTerm: handleChangeSearchTerm,
    result,
    isLoading,
    searchTargets,
    clearSearch,
    totalPages,
    totalResults,
    currentPage,
    onChangePage,
    error
  }
}
