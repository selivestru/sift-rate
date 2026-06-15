import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import dayjs from 'dayjs'
import { MOVIE_GENRES, TV_GENRES } from '~/constants/genres'
import { env } from '~/env'
import { ContentType } from '~/generated/prisma'
import { isDefined } from '~/utils/isDefined'
import { useDiscoverStore } from '../store/discover.store'

interface IDiscoverResponse {
  page: number
  results: (IDiscoverMovieResult | IDiscoverTVResult)[]
  total_pages: number
  total_results: number
}

interface IDiscoverMovieResult {
  id: number
  title: string
  poster_path: string
  genre_ids: (keyof typeof MOVIE_GENRES)[]
  vote_average: number
  release_date: string
}

interface IDiscoverTVResult {
  id: number
  name: string
  poster_path: string
  genre_ids: (keyof typeof TV_GENRES)[]
  vote_average: number
  first_air_date: string
}

export interface IDiscoverItem {
  id: string
  title: string
  coverUrl: string
  genres: string[]
  voteAverage: number
  isReleased: boolean
  type: ContentType
}

const isMovieResult = (
  result: IDiscoverMovieResult | IDiscoverTVResult
): result is IDiscoverMovieResult => {
  return 'title' in result
}

export const useDiscoverQuery = () => {
  const { type, genre, year } = useDiscoverStore()

  return useQuery({
    queryKey: ['discover', type, genre, year],
    queryFn: async () => {
      const { data } = await axios.get<IDiscoverResponse>(
        `https://api.themoviedb.org/3/discover/${type}`,
        {
          headers: {
            Authorization: `Bearer ${env.NEXT_PUBLIC_MOVIE_DB_API_KEY}`
          },
          params: {
            sort_by: 'popularity.desc',
            with_genres: genre,
            page: Math.floor(Math.random() * 10) + 1,
            primary_release_year: year,
            language: 'ru-RU',
            include_adult: false,
            with_original_language: 'en|uk|fr|de|es|it|pl|ru'
          }
        }
      )

      const filteredData = data.results.filter((result) => !!result.poster_path)

      return filteredData.map((result) => {
        const isMovie = isMovieResult(result)

        return {
          id: String(result.id),
          title: isMovie ? result.title : result.name,
          coverUrl: `https://image.tmdb.org/t/p/w500${result.poster_path}`,
          genres: isMovie
            ? result.genre_ids.map((id) => MOVIE_GENRES[id]).filter(isDefined)
            : result.genre_ids.map((id) => TV_GENRES[id]).filter(isDefined),
          voteAverage: result.vote_average,
          isReleased: dayjs(
            isMovie ? result.release_date : result.first_air_date
          ).isBefore(dayjs()),
          type: isMovie ? ContentType.MOVIE : ContentType.TV
        }
      })
    },
    refetchOnWindowFocus: false
  })
}
