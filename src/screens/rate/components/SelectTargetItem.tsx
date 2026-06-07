import { cn } from '@heroui/theme'
import axios from 'axios'
import dayjs from 'dayjs'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { ITargetItem } from '~/components/features/rating'
import { LoadingSpinner } from '~/components/ui/loading-spinner'
import { ReviewCover } from '~/components/ui/review-cover'
import { Show } from '~/components/ui/show'
import { ContentType } from '~/generated/prisma'

interface ISearchTargetItemProps {
  data: ITargetItem
  category: ContentType
}

export const SearchTargetItem = ({
  data,
  category
}: ISearchTargetItemProps) => {
  const router = useRouter()

  const [isFetching, setIsFetching] = useState(false)

  const isVideoContent =
    category === ContentType.MOVIE || category === ContentType.TV
  const rateHref = `/rate/${category.toLowerCase()}/${data.id}`

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    e.stopPropagation()

    setIsFetching(true)

    try {
      const response = await axios.get<{
        url: string | null
      }>('/api/watch', {
        params: {
          title: data.title,
          year: dayjs(data.releaseDate).format('YYYY')
        }
      })

      const watchUrl = response.data?.url

      if (watchUrl) {
        window.open(watchUrl, '_blank', 'noopener,noreferrer')
      }
    } catch (error) {
      console.debug(
        `Error fetching watch link for ${data.title}: ${JSON.stringify(error)}`
      )
    } finally {
      setIsFetching(false)
      router.push(rateHref)
    }
  }

  return (
    <Link
      key={data.id}
      href={rateHref}
      onClick={isVideoContent ? handleClick : undefined}
      className={cn(
        'bg-card-background border-border hover:border-secondary group relative flex w-full cursor-pointer items-center gap-4 overflow-hidden rounded-xl border p-4 transition-all',
        {
          'pointer-events-none': isFetching
        }
      )}>
      <Show when={isFetching}>
        <div className='bg-card-background/70 absolute inset-0 z-2 grid place-items-center'>
          <LoadingSpinner size={32} />
        </div>
      </Show>

      <ReviewCover title={data.title} coverUrl={data.cover} />
      <div className='flex-1 overflow-hidden text-left'>
        <h3 className='group-hover:text-secondary line-clamp-2 text-base font-semibold transition-colors'>
          {data.title}
        </h3>
        <p className='text-muted-foreground text-sm'>{data.description}</p>
      </div>
      <div className='relative size-5'>
        <ChevronRight className='text-muted-foreground group-hover:text-secondary size-full transition-colors' />
        <ChevronRight className='text-muted-foreground group-hover:text-secondary absolute top-0 left-0 size-full transition-all group-hover:translate-x-1.5' />
      </div>
    </Link>
  )
}
