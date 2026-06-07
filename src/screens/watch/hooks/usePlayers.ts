import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useState } from 'react'

export interface IPlayer {
  type: string
  iframeUrl: string
}

interface IResponse {
  data: IPlayer[]
}

export const usePlayers = (id: string) => {
  const [selectedPlayer, setSelectedPlayer] = useState<IPlayer | null>(null)

  const {
    isFetching,
    data: players = [],
    error
  } = useQuery({
    queryKey: ['watch', id],
    queryFn: async () => {
      const { data } = await axios.get<IResponse>(
        `https://fbphdplay.top/api/players?kinopoisk=${id}`
      )

      const players = data?.data

      if (!Array.isArray(players) || players.length === 0) {
        throw new Error('Плееры не найдены')
      }

      return players
    }
  })

  useEffect(() => {
    if (players[0]) {
      setSelectedPlayer(players[0])
    }
  }, [players])

  const changePlayer = (player: IPlayer) => {
    setSelectedPlayer(player)
  }

  return {
    isFetching,
    players,
    selectedPlayer,
    changePlayer,
    error: error?.message ?? null
  }
}
