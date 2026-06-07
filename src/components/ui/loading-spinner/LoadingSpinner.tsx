import { cn } from '@heroui/theme'
import { LoaderIcon } from 'lucide-react'

interface ILoadingSpinnerProps {
  size?: number
  className?: string
}

export const LoadingSpinner = ({
  size = 24,
  className
}: ILoadingSpinnerProps) => {
  return (
    <div
      className={cn(
        'text-secondary my-2 flex animate-spin justify-center',
        className
      )}>
      <LoaderIcon size={size} strokeWidth={3} />
    </div>
  )
}
