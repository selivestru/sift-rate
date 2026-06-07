import { Button } from '@heroui/button'
import { cn } from '@heroui/theme'
import { type Key } from 'react'
import { BADGE_TAB_META } from '~/constants/badge'
import { useRatingList } from '~/contexts/RatingListProvider'
import type {
  IRatingCardData,
  TRatingListContentType
} from '../../types/rating.types'

interface IRatingListContentTypeProps {
  items: IRatingCardData[]
}

export const RatingListContentType = ({
  items
}: IRatingListContentTypeProps) => {
  const { state, setContentType } = useRatingList()

  const onSelectionChange = (key: Key) => {
    const contentType = key.toString() as TRatingListContentType
    setContentType(contentType)
  }

  const selectedContentTypeBg = BADGE_TAB_META[state.contentType].bg

  return (
    <div className='hidden overflow-hidden rounded-xl lg:block'>
      <div className='border-medium border-default-200 relative flex w-full scrollbar-thin gap-2 overflow-x-auto rounded-xl p-1'>
        {Object.entries(BADGE_TAB_META).map(
          ([key, { icon: Icon, text, titlePlural }]) => {
            const tabItems =
              key === 'ALL'
                ? items.length
                : items.filter((item) => item.itemReview.type === key).length
            const formattedCount = new Intl.NumberFormat('ru-RU').format(
              tabItems
            )

            return (
              <Button
                key={key}
                variant={state.contentType === key ? 'flat' : 'light'}
                className={cn(
                  'flex h-auto shrink-0 items-center gap-2 px-4 py-2',
                  text,
                  {
                    [selectedContentTypeBg]: state.contentType === key
                  }
                )}
                onPress={() => onSelectionChange(key)}>
                <Icon size={16} />
                <span>{titlePlural}</span>
                <span>{formattedCount}</span>
              </Button>
            )
          }
        )}
      </div>
    </div>
  )
}
