import type { ITargetItem } from '~/components/features/rating'
import type {
  WishlistItemData,
  WishlistReviewData,
  WishlistSearchStatus
} from '../types/wishlist.types'

interface IGetWishlistSearchStatusParams {
  item: ITargetItem
  wishlistItems: WishlistItemData[]
  reviews: WishlistReviewData[]
}

export const getWishlistSearchStatus = ({
  item,
  wishlistItems,
  reviews
}: IGetWishlistSearchStatusParams): WishlistSearchStatus => {
  if (
    reviews.some((review) => review.itemReview.externalId === String(item.id))
  ) {
    return 'reviewed'
  }

  if (
    wishlistItems.some(
      (wishlistItem) => wishlistItem.itemReview.externalId === String(item.id)
    )
  ) {
    return 'added'
  }

  return 'available'
}
