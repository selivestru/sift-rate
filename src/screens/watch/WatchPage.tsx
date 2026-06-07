'use client'

import { Button } from '@heroui/button'
import { MoveLeftIcon, MoveRightIcon } from 'lucide-react'
import Link from 'next/link'
import { LoadingSpinner } from '~/components/ui/loading-spinner'
import { ROUTES } from '~/constants/routes'
import { ContentType } from '~/generated/prisma'
import { usePlayers } from './hooks/usePlayers'
import { useVideoData } from './hooks/useVideoData'

interface IWatchPageProps {
  id: string
}

export const WatchPage = ({ id }: IWatchPageProps) => {
  const { isFetching, players, selectedPlayer, changePlayer } = usePlayers(id)

  const { data: videoData } = useVideoData(id, selectedPlayer)

  if (isFetching) {
    return <LoadingSpinner />
  }

  return (
    <div className='relative flex flex-1 flex-col gap-4'>
      {videoData && (
        <div className='flex items-center justify-between gap-2'>
          <Button
            as={Link}
            href={ROUTES.REVIEWS}
            color='primary'
            variant='flat'
            className='w-full max-w-62.5 max-sm:max-w-full'
            startContent={<MoveLeftIcon />}>
            Назад
          </Button>
          <h1 className='mx-auto line-clamp-2 text-center text-4xl font-bold'>
            {videoData.title}
          </h1>
          <Button
            as={Link}
            href={`/rate/${(videoData.isTv ? ContentType.TV : ContentType.MOVIE).toLowerCase()}/${videoData.tmdbId}`}
            color='success'
            variant='flat'
            className='w-full max-w-62.5 max-sm:max-w-full'
            endContent={<MoveRightIcon />}>
            Оценить
          </Button>
        </div>
      )}
      {players && (
        <div className='absolute top-1/2 right-0 flex -translate-y-1/2 flex-col gap-2'>
          {players.map((player) => (
            <Button
              key={player.type}
              color='primary'
              variant={selectedPlayer?.type === player.type ? 'solid' : 'faded'}
              className='rounded-r-none'
              onPress={() => changePlayer(player)}>
              {player.type}
            </Button>
          ))}
        </div>
      )}
      {selectedPlayer && (
        <iframe
          allowFullScreen
          className='size-full rounded-xl'
          src={selectedPlayer.iframeUrl}
        />
      )}
    </div>
  )
}
