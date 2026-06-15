import { Select, SelectItem } from '@heroui/select'
import type { SharedSelection } from '@heroui/system'
import { useMemo } from 'react'
import { useDiscoverStore } from '../store/discover.store'

export const DiscoverSelectYear = () => {
  const year = useDiscoverStore((state) => state.year)
  const setYear = useDiscoverStore((state) => state.setYear)

  const selectedKeys = new Set([year])

  const onSelectionChange = (keys: SharedSelection) => {
    if (!keys.anchorKey) return
    setYear(keys.anchorKey)
  }

  const options = useMemo(() => {
    const currentYear = new Date().getFullYear() + 1
    const minYear = 2000
    return Array.from({ length: currentYear - minYear }, (_, i) =>
      String(i + minYear)
    ).reverse()
  }, [])

  return (
    <Select
      label='Выберите год'
      size='sm'
      selectedKeys={selectedKeys}
      onSelectionChange={onSelectionChange}
      classNames={{
        trigger: 'rounded-large'
      }}>
      {options.map((option) => (
        <SelectItem key={option}>{option}</SelectItem>
      ))}
    </Select>
  )
}
