import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Pagination } from '@heroui/pagination'
import { ChevronRight, SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { LoadingSpinner } from '~/components/ui/loading-spinner'
import { ReviewCover } from '~/components/ui/review-cover'
import { Show } from '~/components/ui/show'
import { type ContentType } from '~/generated/prisma'
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

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-2'>
        <Input
          isClearable
          autoComplete='off'
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
