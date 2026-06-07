import { use } from 'react'
import { WatchPage } from '~/screens/watch'

interface IWatchProps {
  params: Promise<{
    id: string
  }>
}

export default function Watch({ params }: IWatchProps) {
  const { id } = use(params)

  return <WatchPage id={id} />
}
