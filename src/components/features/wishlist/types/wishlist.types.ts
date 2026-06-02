import type { RouterOutputs } from '~/trpc/react'

export type WishlistItemData = RouterOutputs['wishlist']['getAll'][number]

export type WishlistReviewData = RouterOutputs['review']['getReviews'][number]

export type WishlistSearchStatus = 'available' | 'added' | 'reviewed'
