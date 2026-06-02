'use client'

import { WishlistList, WishlistSearch } from '~/components/features/wishlist'
import { LoadingSpinner } from '~/components/ui/loading-spinner'
import { ErrorMessage } from '~/components/ui/query'
import { api } from '~/trpc/react'

export const WishlistPage = () => {
  const {
    data: wishlistItems,
    isLoading: isWishlistLoading,
    error: wishlistError,
    refetch: refetchWishlist
  } = api.wishlist.getAll.useQuery()
  const {
    data: reviews,
    isLoading: isReviewsLoading,
    error: reviewsError,
    refetch: refetchReviews
  } = api.review.getReviews.useQuery()

  const isLoading = isWishlistLoading || isReviewsLoading
  const error = wishlistError ?? reviewsError
  const items = wishlistItems ?? []

  const refetch = () => {
    void refetchWishlist()
    void refetchReviews()
  }

  if (isLoading) {
    return (
      <section className='mx-auto flex w-full max-w-5xl justify-center px-4 py-8 lg:px-6'>
        <LoadingSpinner size={32} />
      </section>
    )
  }

  if (error) {
    return (
      <section className='mx-auto flex w-full max-w-5xl justify-center px-4 py-8 lg:px-6'>
        <ErrorMessage message={error.message} onRetry={refetch} />
      </section>
    )
  }

  return (
    <section className='mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 lg:px-6'>
      <WishlistSearch wishlistItems={items} reviews={reviews ?? []} />
      <div className='space-y-3'>
        <div className='flex items-end justify-between gap-4'>
          <div>
            <h2 className='font-roboto-slab text-2xl font-bold tracking-tight'>
              Список ожиданий
            </h2>
          </div>
          <span className='bg-card-background-secondary text-muted-foreground rounded-full px-3 py-1 text-sm font-semibold'>
            {items.length}
          </span>
        </div>
        <WishlistList items={items} />
      </div>
    </section>
  )
}
