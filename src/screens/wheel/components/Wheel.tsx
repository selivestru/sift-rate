import { EmptyState } from '~/components/ui/query'
import { useWheelStore } from '../store/wheel.store'
import { FallenSlotModal } from './FallenSlotModal'
import { SpinWheel } from './SpinWheel'
import { WheelControls } from './WheelControls'
import { WheelSlots } from './WheelSlots'
import { WinnerSlotModal } from './WinnerSlotModal'

export const Wheel = () => {
  const slots = useWheelStore((state) => state.slots)

  if (slots.length === 0) {
    return <EmptyState message='Пока нет слотов' />
  }

  return (
    <>
      <div className='grid gap-4 lg:grid-cols-[1fr_2fr_1fr] lg:gap-10'>
        <div className='order-3 lg:order-1 lg:min-w-0'>
          <WheelSlots />
        </div>
        <div className='order-2 flex justify-center overflow-hidden lg:order-2 lg:min-w-0'>
          <SpinWheel />
        </div>
        <div className='order-1 lg:order-3 lg:min-w-0'>
          <WheelControls />
        </div>
      </div>
      <FallenSlotModal />
      <WinnerSlotModal />
    </>
  )
}
