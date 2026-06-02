import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { useRef } from 'react'
import { useWheelStore } from '../store/wheel.store'

const DEFAULT_DURATION = 5

const normalizeDuration = (value: string) => {
  const parsed = Number.parseInt(value.trim(), 10)

  if (Number.isNaN(parsed) || parsed <= 0) {
    return DEFAULT_DURATION
  }

  return parsed
}

export const WheelControls = () => {
  const {
    slots,
    rotation,
    isSpinning,
    duration,
    mode,
    setMode,
    updateStatus,
    setRotation,
    setDuration,
    setIsSpinning,
    setFallenSlotId,
    setWinnerSlotId
  } = useWheelStore()
  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const activeSlots = slots.filter((slot) => slot.status === 'active')
  const canSpin =
    !isSpinning &&
    ((mode === 'normal' && slots.length > 1) ||
      (mode === 'elimination' && activeSlots.length > 1))

  const handleChangeDuration = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim().replace(/[^0-9]/g, '')
    setDuration(value)
  }

  const handleBlueDuration = () => {
    setDuration(String(normalizeDuration(duration)))
  }

  const handleSpin = () => {
    if (!canSpin) return

    const spinSlots = mode === 'normal' ? slots : activeSlots

    if (spinSlots.length === 0) return

    const spinDuration = normalizeDuration(duration)
    const anglePerSegment = 360 / spinSlots.length
    const baseTurns = Math.max(8, spinDuration * 2)
    const extraDegrees = Math.floor(Math.random() * 360)
    const totalSpin = rotation + baseTurns * 360 + extraDegrees

    setIsSpinning(true)
    setDuration(String(spinDuration))
    setFallenSlotId(null)
    setWinnerSlotId(null)
    setRotation(totalSpin)

    if (spinTimeoutRef.current) {
      clearTimeout(spinTimeoutRef.current)
    }

    spinTimeoutRef.current = setTimeout(() => {
      setIsSpinning(false)

      const actualDegrees = ((totalSpin % 360) + 360) % 360
      const relativeAngle = (360 - actualDegrees) % 360
      const fallingIndex = Math.floor(relativeAngle / anglePerSegment)
      const fallenSlot = spinSlots[fallingIndex]

      if (fallenSlot) {
        if (mode === 'elimination') {
          updateStatus(fallenSlot.id, 'inactive')
          const remainingActiveSlots = spinSlots.filter(
            (slot) => slot.id !== fallenSlot.id
          )

          if (remainingActiveSlots.length === 1) {
            setFallenSlotId(null)
            setWinnerSlotId(remainingActiveSlots[0]!.id)
          } else {
            setFallenSlotId(fallenSlot.id)
          }
        } else {
          setFallenSlotId(fallenSlot.id)
        }
      }

      spinTimeoutRef.current = null
    }, spinDuration * 1000)
  }

  return (
    <div className='border-border bg-card-background flex h-fit flex-col gap-3 rounded-xl border px-4 py-2'>
      <div className='grid grid-cols-2 gap-2'>
        <Button color='primary' onPress={handleSpin} isDisabled={!canSpin}>
          {isSpinning ? 'Крутится...' : 'Крутить'}
        </Button>
        <Input
          autoComplete='off'
          endContent={<span className='text-default-400 text-small'>с</span>}
          value={duration}
          onChange={handleChangeDuration}
          onBlur={handleBlueDuration}
        />
      </div>
      <div className='border-border grid grid-cols-2 rounded-2xl border p-1.5'>
        <Button
          color={mode === 'normal' ? 'primary' : 'default'}
          variant={mode === 'normal' ? 'flat' : 'light'}
          className='rounded-r-none'
          onPress={() => setMode('normal')}>
          Обычное
        </Button>
        <Button
          color={mode === 'elimination' ? 'primary' : 'default'}
          variant={mode === 'elimination' ? 'flat' : 'light'}
          className='rounded-l-none'
          onPress={() => setMode('elimination')}>
          Выбывание
        </Button>
      </div>
    </div>
  )
}
