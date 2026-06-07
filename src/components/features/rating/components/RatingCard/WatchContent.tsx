import { Button } from '@heroui/button'
import { ExternalLinkIcon } from 'lucide-react'
import { LoadingSpinner } from '~/components/ui/loading-spinner'
import { useFetchWatchContent } from '../../hooks/useFetchWatchContent'

interface IWatchContentProps {
  title: string
}

export const WatchContent = ({ title }: IWatchContentProps) => {
  const { isFetching, fetchWatchContent } = useFetchWatchContent()

  return (
    <Button
      isIconOnly
      size='sm'
      variant='flat'
      color='success'
      onPress={() => fetchWatchContent(title)}
      isDisabled={isFetching}>
      {isFetching ? (
        <LoadingSpinner className='text-success' size={16} />
      ) : (
        <ExternalLinkIcon size={16} />
      )}
    </Button>
  )
}
