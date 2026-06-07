import { Button } from '@heroui/button'
import { cn } from '@heroui/theme'
import { useState } from 'react'
import { Slots } from './components/Slots'
import { Wheel } from './components/Wheel'
import { useWheelStore } from './store/wheel.store'

export const WheelPageContent = () => {
  const [page, setPage] = useState<'slots' | 'wheel'>('slots')

  const hasSlots = useWheelStore((state) => state.slots.length > 0)

  const content = {
    slots: <Slots />,
    wheel: <Wheel />
  }[page]

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex justify-center gap-2'>
        <Button
          color={page === 'slots' ? 'secondary' : 'default'}
          className='w-full max-w-50'
          onPress={() => setPage('slots')}>
          Слоты
        </Button>
        <Button
          color={page === 'wheel' ? 'secondary' : 'default'}
          className='w-full max-w-50'
          onPress={() => setPage('wheel')}
          isDisabled={!hasSlots}>
          Колесо
        </Button>
      </div>

      <div
        className={cn('mx-auto flex w-full flex-col gap-3', {
          'max-w-xl': page === 'slots',
          'max-w-360': page === 'wheel'
        })}>
        {content}
      </div>
    </div>
  )
}
