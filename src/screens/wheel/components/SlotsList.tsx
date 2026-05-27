import { EmptyState } from '~/components/ui/query'
import { useWheelStore } from '../store/wheel.store'
import { SlotItem } from './SlotItem'

export const SlotsList = () => {
  const slots = useWheelStore((state) => state.slots)

  if (slots.length === 0) {
    return <EmptyState message='Пока нет слотов' />
  }

  return (
    <div className='flex flex-col gap-2'>
      {slots.map((slot, index) => (
        <SlotItem key={slot.id} position={index + 1} {...slot} />
      ))}
    </div>
  )
}
