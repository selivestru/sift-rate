import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { useRef, useState } from 'react'
import { useWheelStore } from '../store/wheel.store'

export const SlotInput = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState('')

  const addSlot = useWheelStore((state) => state.addSlot)

  const handleAddSlot = () => {
    const trimmed = value.trim()

    if (trimmed.length === 0) {
      inputRef.current?.focus()
      return
    }

    addSlot(trimmed)
    setValue('')
    inputRef.current?.focus()
  }

  return (
    <div className='grid grid-cols-[1fr_auto] gap-3'>
      <Input
        ref={inputRef}
        value={value}
        onValueChange={setValue}
        onKeyDown={(e) => e.key === 'Enter' && handleAddSlot()}
        placeholder='Название нового лота'
      />
      <Button
        color='primary'
        onPress={handleAddSlot}
        isDisabled={value.trim().length === 0}>
        Добавить лот
      </Button>
    </div>
  )
}
