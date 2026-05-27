import { useMemo } from 'react'
import { Show } from '~/components/ui/show'
import { useWheelStore } from '../store/wheel.store'

const WHEEL_SIZE = 550
const WHEEL_PADDING = 10
const LABEL_HEIGHT = 28
const LABEL_WIDTH_SINGLE = 240

const getNormalizedDuration = (value: string) => {
  const parsed = Number.parseInt(value.trim(), 10)

  if (Number.isNaN(parsed) || parsed <= 0) {
    return 5
  }

  return parsed
}

const normalizeLabelRotation = (angle: number) => {
  const normalized = ((angle % 360) + 360) % 360

  if (normalized > 90 && normalized < 270) {
    return normalized - 180
  }

  if (normalized >= 270) {
    return normalized - 360
  }

  return normalized
}

const getLabelWidth = (
  radius: number,
  anglePerSegment: number,
  totalItems: number
) => {
  if (totalItems <= 1) {
    return LABEL_WIDTH_SINGLE
  }

  const arcWidth = 2 * radius * Math.sin((anglePerSegment * Math.PI) / 360)

  return Math.max(56, Math.min(arcWidth * 0.7, 180))
}

export const SpinWheel = () => {
  const { slots, mode, isSpinning, rotation, duration } = useWheelStore()

  const size = WHEEL_SIZE
  const center = size / 2
  const radius = size / 2 - WHEEL_PADDING

  const activeSlots = useMemo(
    () =>
      mode === 'normal'
        ? slots
        : slots.filter((slot) => slot.status === 'active'),
    [slots, mode]
  )
  const totalItems = activeSlots.length
  const anglePerSegment = totalItems > 0 ? 360 / totalItems : 0
  const transitionDuration = getNormalizedDuration(duration)

  const segments = useMemo(() => {
    return activeSlots.map((slot, index) => {
      const startAngle = index * anglePerSegment
      const endAngle = startAngle + anglePerSegment
      const midAngle = startAngle + anglePerSegment / 2
      const textRadius =
        totalItems <= 2
          ? radius * 0.56
          : anglePerSegment < 40
            ? radius * 0.43
            : radius * 0.5
      const labelWidth = getLabelWidth(radius, anglePerSegment, totalItems)

      const startRad = ((startAngle - 90) * Math.PI) / 180
      const endRad = ((endAngle - 90) * Math.PI) / 180
      const textRad = ((midAngle - 90) * Math.PI) / 180

      const x1 = center + radius * Math.cos(startRad)
      const y1 = center + radius * Math.sin(startRad)
      const x2 = center + radius * Math.cos(endRad)
      const y2 = center + radius * Math.sin(endRad)
      const textX = center + textRadius * Math.cos(textRad)
      const textY = center + textRadius * Math.sin(textRad)

      const largeArcFlag = anglePerSegment > 180 ? 1 : 0

      const pathData =
        totalItems === 1
          ? ''
          : [
              `M ${center} ${center}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ')

      return {
        ...slot,
        pathData,
        midAngle,
        textX,
        textY,
        labelWidth,
        labelRotation:
          totalItems === 1 ? 0 : normalizeLabelRotation(midAngle + 90)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlots])

  return (
    <div className='relative aspect-square w-full max-w-150'>
      <svg
        width='34'
        height='34'
        viewBox='0 0 34 34'
        className='absolute top-0 left-1/2 z-10 -translate-x-1/2'>
        <path
          d='M 2 2 L 32 2 L 17 32 Z'
          className='fill-primary stroke-white'
          strokeWidth='2'
          strokeLinejoin='miter'
        />
      </svg>
      <svg
        width='100%'
        height='100%'
        viewBox={`0 0 ${size} ${size}`}
        className='border-border h-full w-full rounded-full border'
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning
            ? `transform ${transitionDuration}s cubic-bezier(0, 1, 0.5, 1)`
            : 'none'
        }}>
        {segments.map((seg) => (
          <g key={seg.id}>
            {totalItems === 1 ? (
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill={seg.color}
                className='stroke-card-background stroke-4'
              />
            ) : (
              <path
                d={seg.pathData}
                fill={seg.color}
                className='stroke-card-background stroke-4'
              />
            )}

            <g
              transform={`translate(${totalItems === 1 ? center : seg.textX} ${totalItems === 1 ? center : seg.textY}) rotate(${seg.labelRotation})`}>
              <foreignObject
                x={-(seg.labelWidth / 2)}
                y={-(LABEL_HEIGHT / 2)}
                width={seg.labelWidth}
                height={LABEL_HEIGHT}>
                <div className='pointer-events-none flex h-full items-center justify-center px-2'>
                  <span className='block w-full truncate text-center text-sm font-bold text-white select-none'>
                    {seg.name}
                  </span>
                </div>
              </foreignObject>
            </g>
          </g>
        ))}

        <Show when={totalItems > 1}>
          <circle
            cx={center}
            cy={center}
            r={10}
            className='fill-card-background shadow-md'
          />
        </Show>
      </svg>
    </div>
  )
}
