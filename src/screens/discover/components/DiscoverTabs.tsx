import { Tab, Tabs } from '@heroui/tabs'
import { cn } from '@heroui/theme'
import type { Key } from 'react'
import { MOVIE_META, TV_META } from '~/constants/badge'
import { useDiscoverStore, type DiscoverType } from '../store/discover.store'

export const DiscoverTabs = () => {
  const type = useDiscoverStore((state) => state.type)
  const setType = useDiscoverStore((state) => state.setType)

  const onSelectionChange = (key: Key) => {
    const tab = key.toString() as DiscoverType
    setType(tab)
  }

  return (
    <Tabs
      fullWidth
      aria-label='Tabs'
      size='lg'
      selectedKey={type}
      onSelectionChange={onSelectionChange}>
      <Tab
        key='movie'
        title={
          <div className={cn('flex items-center space-x-2', MOVIE_META.text)}>
            {<MOVIE_META.icon size={16} />}
            <span>{MOVIE_META.titlePlural}</span>
          </div>
        }
      />
      <Tab
        key='tv'
        title={
          <div className={cn('flex items-center space-x-2', TV_META.text)}>
            {<TV_META.icon size={16} />}
            <span>{TV_META.titlePlural}</span>
          </div>
        }
      />
    </Tabs>
  )
}
