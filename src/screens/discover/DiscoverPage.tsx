'use client'

import { Button } from '@heroui/button'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { DiscoverCard } from './components/DiscoverCard'
import { DiscoverSelectGenre } from './components/DiscoverSelectGenre'
import { DiscoverSelectYear } from './components/DiscoverSelectYear'
import { DiscoverTabs } from './components/DiscoverTabs'
import { useDiscoverQuery } from './hooks/useDiscoverQuery'
import { useDiscoverStore } from './store/discover.store'

export const DISCOVER_VISIBLE_CARDS = 3

export type DiscoverType = 'movie' | 'tv'

export const DiscoverPage = () => {
  const { data, isFetching, refetch } = useDiscoverQuery()

  const resetDiscover = useDiscoverStore((state) => state.reset)

  useEffect(() => {
    return () => {
      resetDiscover()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='flex flex-col gap-3'>
      <DiscoverTabs />
      <div className='grid grid-cols-3 gap-3 max-md:grid-cols-1 max-md:grid-rows-3'>
        <DiscoverSelectGenre />
        <DiscoverSelectYear />
        <Button
          size='lg'
          color='primary'
          isLoading={isFetching}
          onPress={() => refetch()}>
          Обновить подборку
        </Button>
      </div>
      {!isFetching && data && data.length > 0 && (
        <div className='relative mx-auto aspect-2/3 w-full max-w-100 max-md:max-w-none'>
          <AnimatePresence>
            {data.slice(0, DISCOVER_VISIBLE_CARDS).map((item, index) => (
              <DiscoverCard key={item.id} index={index} {...item} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
