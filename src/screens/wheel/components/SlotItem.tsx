import { Button } from '@heroui/button'
import { Trash2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDebounceCallback } from '~/hooks/useDebounceCallback'
import { useWheelStore, type Slot } from '../store/wheel.store'

interface ISlotItemProps extends Slot {
  position: number
}

export const SlotItem = ({ position, id, name }: ISlotItemProps) => {
  const [value, setValue] = useState(name)

  const { updateName, removeSlot } = useWheelStore()

  const debounced = useDebounceCallback(updateName, 500)

  useEffect(() => {
    debounced(id, value)
  }, [id, value, debounced])

  return (
    <div className='border-border bg-card-background flex items-center justify-between gap-2 rounded-xl border py-1 pr-1 pl-3'>
      <span className='text-muted-foreground'>{position}.</span>
      <input
        autoComplete='off'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className='size-full outline-none'
        placeholder='Название'
      />
      <Button
        isIconOnly
        color='danger'
        variant='flat'
        onPress={() => removeSlot(id)}>
        <Trash2Icon size={20} />
      </Button>
    </div>
  )
}
