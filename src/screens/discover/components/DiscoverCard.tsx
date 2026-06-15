import { Button } from '@heroui/button'
import { addToast } from '@heroui/toast'
import { useQueryClient } from '@tanstack/react-query'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { PlayIcon, StarIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { useFetchWatchContent } from '~/components/features/rating/hooks/useFetchWatchContent'
import { Badge } from '~/components/ui/badge'
import { LoadingSpinner } from '~/components/ui/loading-spinner'
import { ReviewCover } from '~/components/ui/review-cover'
import { Show } from '~/components/ui/show'
import { ContentType } from '~/generated/prisma'
import { DISCOVER_VISIBLE_CARDS } from '../DiscoverPage'
import type { IDiscoverItem } from '../hooks/useDiscoverQuery'
import { useDiscoverStore } from '../store/discover.store'

const DRAG_THRESHOLD = 200

interface IDiscoverCardProps extends IDiscoverItem {
  index: number
}

export const DiscoverCard = ({
  index,
  id,
  title,
  coverUrl,
  genres,
  voteAverage,
  isReleased,
  type
}: IDiscoverCardProps) => {
  const { isFetching, fetchWatchContent } = useFetchWatchContent()

  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(
    null
  )

  const queryClient = useQueryClient()

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-20, 20])

  const onDismiss = (direction: 'left' | 'right') => {
    const { type, genre, year } = useDiscoverStore.getState()

    if (direction === 'left') {
      const queryKey = ['discover', type, genre, year]

      queryClient.setQueryData<IDiscoverItem[]>(queryKey, (prev) => {
        if (!prev) return prev
        return prev.filter((item) => item.id !== id)
      })

      const remainingData = queryClient.getQueryData<IDiscoverItem[]>(queryKey)

      if (!remainingData?.length) {
        void queryClient.refetchQueries({ queryKey })
      }
    } else {
      void animate(x, 0, { duration: 0.2 }).then(() => {
        void fetchWatchContent(title, year)
      })
    }
  }

  const overlayOpacity = useTransform(x, [-200, 0, 200], [1, 0, 1])

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.5
      }}
      animate={{
        opacity: 1,
        scale: 1 - index * 0.05
      }}
      exit={{
        opacity: 0
      }}
      style={{
        x,
        scale: 1 - index * 0.05,
        zIndex: DISCOVER_VISIBLE_CARDS - index,
        rotate
      }}
      className='absolute inset-0 overflow-hidden rounded-2xl'
      dragConstraints={{
        left: 0,
        right: 0
      }}
      drag={index === 0 ? 'x' : false}
      onDrag={(_, info) => {
        if (info.offset.x > 50) {
          setDragDirection('right')
        } else if (info.offset.x < -50) {
          setDragDirection('left')
        } else {
          setDragDirection(null)
        }
      }}
      onDragEnd={(_, info) => {
        setDragDirection(null)

        if (info.offset.x > DRAG_THRESHOLD) {
          if (!isReleased) {
            void animate(x, 0, { duration: 0.2 }).then(() => {
              addToast({
                title: 'Ошибка',
                description: `${type === ContentType.MOVIE ? 'Фильм' : 'Сериал'} ещё не вышел`,
                color: 'danger'
              })
            })
          } else {
            void animate(x, 300, { duration: 0.2 }).then(() =>
              onDismiss('right')
            )
          }
        } else if (info.offset.x < -DRAG_THRESHOLD) {
          void animate(x, -300, { duration: 0.2 }).then(() => onDismiss('left'))
        }
      }}>
      <div className='relative size-full'>
        <ReviewCover
          unoptimized
          category={type}
          coverUrl={coverUrl}
          title={title}
          className='pointer-events-none size-full'
          imageClassName='object-cover pointer-events-none'
        />
        <Show when={isFetching}>
          <div className='absolute inset-0 z-2 bg-black/60' />
          <div className='absolute inset-0 z-3 flex items-center justify-center'>
            <LoadingSpinner />
          </div>
        </Show>

        <div className='absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black to-transparent' />
        <div className='absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-black to-transparent' />

        <Badge type={type} className='absolute top-4 left-4' />

        <Show when={voteAverage > 0}>
          <div className='absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 backdrop-blur-sm'>
            <StarIcon className='size-3.5 fill-yellow-400 text-yellow-400' />
            <span className='text-sm font-semibold text-white'>
              {voteAverage.toFixed(1)}
            </span>
          </div>
        </Show>

        <div className='absolute right-0 bottom-0 left-0 space-y-3 p-4'>
          <h3 className='text-xl leading-tight font-bold text-white'>
            {title}
          </h3>

          {genres.length > 0 && (
            <div className='flex flex-wrap gap-1.5'>
              {genres.slice(0, 3).map((genre) => (
                <span
                  key={genre}
                  className='rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/80 backdrop-blur-sm'>
                  {genre}
                </span>
              ))}
            </div>
          )}

          <div className='z-px relative grid grid-cols-2 gap-4'>
            <Button
              size='sm'
              className='bg-red-500 font-bold'
              onPress={() => {
                void animate(x, -300, { duration: 0.2 }).then(() =>
                  onDismiss('left')
                )
              }}>
              Не интересно
            </Button>
            <Button
              size='sm'
              className='bg-green-500 font-bold text-black'
              onPress={() => {
                if (!isReleased) {
                  addToast({
                    title: 'Ошибка',
                    description: `${type === ContentType.MOVIE ? 'Фильм' : 'Сериал'} ещё не вышел`,
                    color: 'danger'
                  })
                  return
                }

                void animate(x, 300, { duration: 0.2 }).then(() =>
                  onDismiss('right')
                )
              }}>
              Смотреть
            </Button>
          </div>
        </div>
      </div>

      <motion.div
        style={{ opacity: overlayOpacity }}
        className='pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/60'>
        <Show when={dragDirection === 'left'}>
          <div className='grid size-12 place-items-center rounded-full bg-red-500'>
            <XIcon strokeWidth={3} className='size-[60%] text-white' />
          </div>
        </Show>

        <Show when={dragDirection === 'right'}>
          <div className='grid size-12 place-items-center rounded-full bg-green-500'>
            <PlayIcon strokeWidth={3} className='size-[60%] text-black' />
          </div>
        </Show>
      </motion.div>
    </motion.div>
  )
}
