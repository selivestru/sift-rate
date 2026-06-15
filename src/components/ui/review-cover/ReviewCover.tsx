import { cn } from '@heroui/theme'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { ContentType } from '~/generated/prisma'

const DEFAULT_COVER = '/images/no-poster-available.webp'

interface IProps {
  category: ContentType
  coverUrl: string | null | undefined
  title: string
  className?: string
  imageClassName?: string
  unoptimized?: boolean
}

export const ReviewCover = ({
  category,
  coverUrl,
  title,
  className,
  imageClassName,
  unoptimized = false
}: IProps) => {
  const cover = coverUrl ?? DEFAULT_COVER

  const imgSrcRef = useRef(cover)
  const [hasError, setHasError] = useState(false)

  const isMusic =
    category === ContentType.SONG || category === ContentType.ALBUM

  return (
    <div
      className={cn(
        'ring-border/20 relative shrink-0 overflow-hidden rounded-lg ring-1',
        'h-fit w-40',
        {
          'aspect-square': isMusic
        },
        className
      )}>
      <Image
        unoptimized={unoptimized}
        quality={100}
        width={160}
        height={isMusic ? 160 : 300}
        src={hasError ? DEFAULT_COVER : imgSrcRef.current}
        onError={() => setHasError(true)}
        alt={title}
        className={cn(
          'h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-110',
          imageClassName
        )}
      />
    </div>
  )
}
