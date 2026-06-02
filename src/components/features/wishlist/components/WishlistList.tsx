import { EmptyState } from '~/components/ui/query'
import type { WishlistItemData } from '../types/wishlist.types'
import { WishlistItemCard } from './WishlistItemCard'

interface IWishlistListProps {
  items: WishlistItemData[]
}

export const WishlistList = ({ items }: IWishlistListProps) => {
  if (items.length === 0) {
    return (
      <div className='border-border bg-card-background rounded-2xl border border-dashed p-8'>
        <EmptyState message='Пока нет объектов в ожиданиях' />
      </div>
    )
  }

  return (
    <div className='space-y-3'>
      {items.map((item) => (
        <WishlistItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}
