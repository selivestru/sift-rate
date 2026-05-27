'use client'

import { Button } from '@heroui/button'
import { Textarea } from '@heroui/input'
import { Controller } from 'react-hook-form'
import type { ISelectedTargetItem } from '~/components/features/rating'
import { Badge } from '~/components/ui/badge'
import { ReviewCover } from '~/components/ui/review-cover'
import { StarRating } from '~/components/ui/star-rating'
import { MAX_REVIEW_LENGTH } from '~/constants/review'
import { useRateSubmit } from '../hooks/useRateSubmit'

interface ISubmitRatingProps {
  targetItem: ISelectedTargetItem
}

export const SubmitRating = ({ targetItem }: ISubmitRatingProps) => {
  const { onSubmit, isCreating, control } = useRateSubmit(targetItem)

  return (
    <form onSubmit={onSubmit}>
      <div className='lg:border-border bg-card-background relative mb-4 rounded-xl p-3 lg:mb-8 lg:border lg:p-6'>
        <Badge type={targetItem.type} className='absolute top-6 right-6' />
        <div className='mb-6 flex items-center gap-4'>
          <ReviewCover
            title={targetItem.title}
            coverUrl={targetItem.coverUrl}
          />
          <div className='overflow-hidden'>
            <h2 className='line-clamp-2 font-semibold'>{targetItem.title}</h2>
            <p className='text-muted-foreground text-sm'>
              {targetItem.description}
            </p>
          </div>
        </div>
        <div className='mb-6'>
          <label className='text-foreground mb-3 block text-sm font-semibold'>
            Рейтинг
          </label>
          <Controller
            name='rating'
            control={control}
            render={({ field: { onChange, value } }) => (
              <StarRating rating={value} onChange={onChange} />
            )}
          />
        </div>
        <Controller
          name='review'
          control={control}
          render={({ field: { onChange, value } }) => (
            <Textarea
              isClearable
              value={value}
              onChange={onChange}
              label='Комментарий (опционально)'
              placeholder='Поделитесь своими впечатлениями...'
              variant='faded'
              minRows={6}
              maxLength={MAX_REVIEW_LENGTH}
              description={`${value.length}/${MAX_REVIEW_LENGTH}`}
            />
          )}
        />
      </div>
      <Button type='submit' fullWidth color='secondary' isLoading={isCreating}>
        {isCreating ? 'Сохранение...' : 'Сохранить оценку'}
      </Button>
    </form>
  )
}
