import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Pagination } from '@heroui/pagination'
import { addToast } from '@heroui/toast'
import axios from 'axios'
import { ChevronRight, SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { LoadingSpinner } from '~/components/ui/loading-spinner'
import { ReviewCover } from '~/components/ui/review-cover'
import { Show } from '~/components/ui/show'
import { env } from '~/env'
import { ContentType } from '~/generated/prisma'
import { useTargetSearch } from '../hooks/useTargetSearch'
import { getItemCountText } from '../utils/getItemCountText'

interface ISelectTargetProps {
  category: ContentType
}

export const SelectTarget = ({ category }: ISelectTargetProps) => {
  const {
    searchTerm,
    setSearchTerm,
    clearSearch,
    result,
    isLoading,
    searchTargets,
    currentPage,
    onChangePage,
    totalPages,
    totalResults,
    error
  } = useTargetSearch(category)

  const getViewLink =
    (id: string) => async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      console.debug('id', id)

      try {
        const imdbId = await axios
          .get<{
            imdb_id?: string
          }>(`https://api.themoviedb.org/3/tv/${id}/external_ids`, {
            headers: {
              Authorization: `Bearer ${env.NEXT_PUBLIC_MOVIE_DB_API_KEY}`
            }
          })
          .then((res) => res.data.imdb_id)

        if (!imdbId) {
          throw new Error('No imdb id found')
        }

        const url = new URL('https://proxy.scalar.com')
        url.searchParams.set(
          'scalar_url',
          `https://api.poiskkino.dev/v1.5/movie?selectFields=id&externalId.imdb=${imdbId}&limit=1`
        )

        const response = await axios.get<{ docs: { id: string }[] }>(url.href, {
          headers: {
            'X-API-KEY': `${env.NEXT_PUBLIC_POISKKINO_API_KEY}`
          }
        })

        const movieId = response.data?.docs?.[0]?.id

        if (!movieId) {
          throw new Error('No results found')
        }

        const viewLink = `https://www.kinopoisk.vip/${category === ContentType.MOVIE ? 'film' : 'series'}/${movieId}`

        window.open(viewLink, '_blank')
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.log(`Error getting view link: ${error}`)

        addToast({
          title: 'Ошибка',
          description: 'Не удалось получить ссылку на фильм',
          color: 'danger'
        })
      }
    }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-2'>
        <Input
          isClearable
          placeholder='Введите название...'
          value={searchTerm}
          onValueChange={setSearchTerm}
          size='lg'
          onKeyDown={async (e) => {
            if (e.key === 'Enter') await searchTargets()
          }}
          onClear={clearSearch}
          isDisabled={isLoading}
        />
        <Button
          isIconOnly
          size='lg'
          variant='flat'
          onPress={() => searchTargets()}
          isDisabled={isLoading || searchTerm.trim().length === 0}>
          <SearchIcon />
        </Button>
      </div>
      <Show when={isLoading}>
        <LoadingSpinner />
      </Show>
      {error && (
        <p className='text-muted-foreground text-center text-base'>{error}</p>
      )}
      {!isLoading && totalResults > 0 && (
        <p className='text-muted-foreground text-center text-base'>
          Всего: {totalResults} {getItemCountText(totalResults, category)}
        </p>
      )}
      {!isLoading && result?.length === 0 && (
        <p className='text-muted-foreground text-center text-base'>
          Ничего не найдено
        </p>
      )}
      <div className='z-px flex flex-col gap-3'>
        {result?.map((result) => (
          <Link
            key={result.id}
            href={`/rate/${category.toLowerCase()}/${result.id}`}
            className='bg-card-background border-border hover:border-secondary group relative flex w-full cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all'>
            <Show
              when={
                category === ContentType.MOVIE || category === ContentType.TV
              }>
              <button
                className='border-border bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground/80 absolute top-4 right-4 z-10 cursor-pointer rounded-xl border px-3 py-1.5 text-sm font-medium transition-all hover:scale-105'
                onClick={getViewLink(result.id)}>
                Получить ссылку на просмотр
              </button>
            </Show>
            <ReviewCover title={result.title} coverUrl={result.cover} />
            <div className='flex-1 overflow-hidden text-left'>
              <h3 className='group-hover:text-secondary line-clamp-2 text-base font-semibold transition-colors'>
                {result.title}
              </h3>
              <p className='text-muted-foreground text-sm'>
                {result.description}
              </p>
            </div>
            <div className='relative size-5'>
              <ChevronRight className='text-muted-foreground group-hover:text-secondary size-full transition-colors' />
              <ChevronRight className='text-muted-foreground group-hover:text-secondary absolute top-0 left-0 size-full transition-all group-hover:translate-x-1.5' />
            </div>
          </Link>
        ))}
      </div>
      {!isLoading && totalPages > 1 && (
        <Pagination
          showControls
          classNames={{
            base: 'sticky bottom-23 lg:bottom-2 m-0',
            wrapper: 'mx-auto'
          }}
          page={currentPage}
          onChange={onChangePage}
          total={totalPages}
        />
      )}
    </div>
  )
}
