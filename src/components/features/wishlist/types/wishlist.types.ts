import type { RouterOutputs } from '~/trpc/react'

export type WishlistItemData = RouterOutputs['wishlist']['getAll']

export type WishlistReviewData = RouterOutputs['review']['getReviews']

export type WishlistSearchStatus = 'available' | 'added' | 'reviewed'
