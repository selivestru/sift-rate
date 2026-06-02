import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { SearchIcon } from 'lucide-react'
import { useState } from 'react'
import { LoadingSpinner } from '~/components/ui/loading-spinner'
import { EmptyState } from '~/components/ui/query'
import type { ContentType } from '~/generated/prisma'
import { useAddWishlistItem } from '../hooks/useAddWishlistItem'
import { useWishlistSearch } from '../hooks/useWishlistSearch'
import type {
  WishlistItemData,
  WishlistReviewData
} from '../types/wishlist.types'
import { getWishlistSearchStatus } from '../utils/getWishlistSearchStatus'
import { WishlistCategoryTabs } from './WishlistCategoryTabs'
import { WishlistSearchResultCard } from './WishlistSearchResultCard'

interface IWishlistSearchProps {
  wishlistItems: WishlistItemData[]
  reviews: WishlistReviewData[]
}

export const WishlistSearch = ({
  wishlistItems,
  reviews
}: IWishlistSearchProps) => {
  const [selectedType, setSelectedType] = useState<ContentType>('MOVIE')
  const [activeExternalId, setActiveExternalId] = useState<string | null>(null)
  const {
    searchTerm,
    setSearchTerm,
    result,
    isLoading,
    searchTargets,
    clearSearch,
    error
  } = useWishlistSearch(selectedType)
  const { handleAdd, isAdding } = useAddWishlistItem()

  const handleTypeChange = (type: ContentType) => {
    setSelectedType(type)
    clearSearch()
  }

  return (
    <section className='bg-card-background border-border rounded-3xl border p-4 shadow-sm sm:p-5'>
      <div className='mb-5 space-y-1'>
        <p className='text-muted-foreground text-sm font-medium'>
          Добавить в ожидания
        </p>
      </div>

      <div className='space-y-4'>
        <WishlistCategoryTabs
          selectedType={selectedType}
          onChange={handleTypeChange}
        />
        <div className='flex items-center gap-2'>
          <Input
            isClearable
            autoComplete='off'
            placeholder='Введите название...'
            value={searchTerm}
            onValueChange={setSearchTerm}
            size='lg'
            startContent={
              <SearchIcon className='text-muted-foreground size-4' />
            }
            onKeyDown={async (event) => {
              if (event.key === 'Enter') await searchTargets()
            }}
            onClear={clearSearch}
            isDisabled={isLoading}
          />
          <Button
            isIconOnly
            size='lg'
            color='secondary'
            variant='flat'
            aria-label='Искать'
            onPress={() => searchTargets()}
            isDisabled={isLoading || searchTerm.trim().length === 0}>
            <SearchIcon className='size-5' />
          </Button>
        </div>
      </div>

      <div className='mt-5 space-y-3'>
        {isLoading && <LoadingSpinner />}
        {error && (
          <p className='text-muted-foreground text-center text-base'>{error}</p>
        )}
        {!isLoading && result?.length === 0 && (
          <div className='border-border rounded-2xl border border-dashed p-6'>
            <EmptyState message='Ничего не найдено' />
          </div>
        )}
        {result?.map((item) => {
          const status = getWishlistSearchStatus({
            item,
            wishlistItems,
            reviews
          })
          const isItemAdding = isAdding && activeExternalId === item.id

          return (
            <WishlistSearchResultCard
              key={item.id}
              item={item}
              type={selectedType}
              status={status}
              isLoading={isItemAdding}
              onAdd={async (item) => {
                setActiveExternalId(item.id)
                await handleAdd({
                  externalId: item.id,
                  title: item.title,
                  coverUrl: item.cover,
                  type: selectedType
                })
                setActiveExternalId(null)
              }}
            />
          )
        })}
      </div>
    </section>
  )
}
