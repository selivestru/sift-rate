import { create } from 'zustand'
import { MOVIE_GENRES, TV_GENRES } from '~/constants/genres'

export type DiscoverType = 'movie' | 'tv'

interface State {
  type: DiscoverType
  genre: string
  year: string
}

interface Actions {
  setType: (type: DiscoverType) => void
  setGenre: (genres: string) => void
  setYear: (year: string) => void
  reset: () => void
}

type Store = State & Actions

export const useDiscoverStore = create<Store>((set) => ({
  type: 'movie',
  genre: String(Object.keys(MOVIE_GENRES)[0]!),
  year: new Date().getFullYear().toString(),

  setType: (type) => {
    const genre = String(
      Object.keys(type === 'movie' ? MOVIE_GENRES : TV_GENRES)[0]!
    )

    set({ type, genre })
  },
  setGenre: (genre) => set({ genre }),
  setYear: (year) => set({ year }),
  reset: () =>
    set({
      type: 'movie',
      genre: String(Object.keys(MOVIE_GENRES)[0]!),
      year: new Date().getFullYear().toString()
    })
}))
