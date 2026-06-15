import { Select, SelectItem } from '@heroui/select'
import type { SharedSelection } from '@heroui/system'
import { MOVIE_GENRES, TV_GENRES } from '~/constants/genres'
import { useDiscoverStore } from '../store/discover.store'

export const DiscoverSelectGenre = () => {
  const type = useDiscoverStore((state) => state.type)
  const genre = useDiscoverStore((state) => state.genre)
  const setGenre = useDiscoverStore((state) => state.setGenre)

  const selectedKeys = new Set([genre])

  const onSelectionChange = (keys: SharedSelection) => {
    if (!keys.anchorKey) return
    setGenre(keys.anchorKey)
  }

  const options = Object.entries(type === 'movie' ? MOVIE_GENRES : TV_GENRES)

  return (
    <Select
      label='Выберите жанр'
      size='sm'
      selectedKeys={selectedKeys}
      onSelectionChange={onSelectionChange}
      classNames={{
        trigger: 'rounded-large'
      }}>
      {options.map(([id, name]) => (
        <SelectItem key={String(id)}>{name}</SelectItem>
      ))}
    </Select>
  )
}
