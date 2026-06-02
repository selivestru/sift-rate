import { Button } from '@heroui/button'
import { cn } from '@heroui/theme'
import { BADGE_META } from '~/constants/badge'
import type { ContentType } from '~/generated/prisma'

const CATEGORIES: ContentType[] = ['MOVIE', 'TV', 'SONG', 'ALBUM', 'GAME', 'BOOK']

interface IWishlistCategoryTabsProps {
  selectedType: ContentType
  onChange: (type: ContentType) => void
}

export const WishlistCategoryTabs = ({
  selectedType,
  onChange
}: IWishlistCategoryTabsProps) => {
  return (
    <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6'>
      {CATEGORIES.map((category) => {
        const { title, icon: Icon } = BADGE_META[category]
        const isSelected = selectedType === category

        return (
          <Button
            key={category}
            variant={isSelected ? 'solid' : 'flat'}
            color={isSelected ? 'secondary' : 'default'}
            className={cn('justify-start px-3 font-semibold', {
              'bg-card-background-secondary': !isSelected
            })}
            startContent={<Icon className='size-4' />}
            onPress={() => onChange(category)}>
            {title}
          </Button>
        )
      })}
    </div>
  )
}
