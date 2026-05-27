import { Button } from '@heroui/button'
import { Checkbox } from '@heroui/checkbox'
import { cn } from '@heroui/theme'
import { Tooltip } from '@heroui/tooltip'
import { RotateCcw } from 'lucide-react'
import { Show } from '~/components/ui/show'
import { useWheelStore } from '../store/wheel.store'

export const WheelSlots = () => {
  const {
    slots,
    mode,
    hideEliminatedSlots,
    setHideEliminatedSlots,
    resetStatus
  } = useWheelStore()

  const activeSlots = slots.filter((slot) => slot.status === 'active')
  const inactiveSlots = slots.filter((slot) => slot.status === 'inactive')
  const filteredSlots = hideEliminatedSlots ? activeSlots : slots

  return (
    <div className='flex flex-col gap-3'>
      <Show when={mode === 'elimination'}>
        <div className='flex items-center justify-between gap-2'>
          <Checkbox
            isSelected={hideEliminatedSlots}
            onValueChange={setHideEliminatedSlots}>
            Скрыть выбывшие лоты
          </Checkbox>
          <Tooltip content='Сбросить'>
            <Button
              isIconOnly
              variant='light'
              color='danger'
              onPress={resetStatus}
              isDisabled={inactiveSlots.length === 0}>
              <RotateCcw />
            </Button>
          </Tooltip>
        </div>
      </Show>
      <div className='flex max-h-125 flex-col gap-2 overflow-hidden overflow-y-auto'>
        {filteredSlots.map(({ id, name, status }, index) => (
          <div
            key={id}
            className='border-border bg-card-background relative flex shrink-0 items-center gap-2 truncate rounded-xl border px-4 py-2'>
            <span className='text-muted-foreground'>{index + 1}.</span>
            <p
              className={cn('truncate', {
                'text-muted-foreground line-through':
                  mode === 'elimination' && status === 'inactive'
              })}>
              {name}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
