import axios from 'axios'
import dayjs from 'dayjs'
import { env } from '~/env'
import { ContentType } from '~/generated/prisma'
import type {
  IAlbumTargetItem,
  IBookTargetItem,
  IGameTargetItem,
  IMovieTargetItem,
  ISearchResult,
  ISelectedTargetItem,
  ISongTargetItem,
  ITargetItem,
  ITvTargetItem
} from '../types/search.types'

const isDefined = <T>(value: T | undefined): value is T => value !== undefined

const LIMIT_PER_PAGE = 20
const getPages = (total: number, limit = LIMIT_PER_PAGE) =>
  Math.ceil(total / limit)

export class SearchService {
  async search(
    category: ContentType,
    query: string,
    page: number
  ): Promise<ISearchResult> {
    switch (category) {
      case 'MOVIE':
        return this.searchMovies(query, page)
      case 'TV':
        return this.searchTv(query, page)
      case 'SONG':
        return this.searchSongs(query, page)
      case 'ALBUM':
        return this.searchAlbums(query, page)
      case 'GAME':
        return this.searchGames(query, page)
      case 'BOOK':
        return this.searchBooks(query, page)
    }
  }

  async searchById(
    category: ContentType,
    id: string
  ): Promise<ISelectedTargetItem | null> {
    switch (category) {
      case 'MOVIE':
        return this.searchMovieById(id)
      case 'TV':
        return this.searchTvById(id)
      case 'SONG':
        return this.searchSongById(id)
      case 'ALBUM':
        return this.searchAlbumById(id)
      case 'GAME':
        return this.searchGameById(id)
      case 'BOOK':
        return this.searchBookById(id)
    }
  }

  private async searchMovies(
    query: string,
    page: number
  ): Promise<ISearchResult> {
    const { data } = await axios.get<{
      results: IMovieTargetItem[]
      page: number
      total_pages: number
      total_results: number
    }>(`https://api.themoviedb.org/3/search/movie`, {
      headers: {
        Authorization: `Bearer ${env.NEXT_PUBLIC_MOVIE_DB_API_KEY}`
      },
      params: {
        query,
        language: 'ru-RU',
        page,
        include_adult: true
      }
    })

    if (data.total_results === 0) {
      return {
        items: [],
        page,
        totalPages: 1,
        totalResults: 0
      }
    }

    const result: ITargetItem[] = data.results.map((item) => {
      const title = item.title
      const genres = item.genre_ids
        .map((id) => this.getMovieGenreName(id))
        .filter(isDefined)
      const releaseDate = item.release_date
      const cover = item.poster_path
        ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
        : undefined

      const description = this.joinDescription([
        ...genres,
        releaseDate ? dayjs(releaseDate).format('YYYY') : ''
      ])

      return {
        id: String(item.id),
        title,
        description,
        cover,
        releaseDate
      }
    })

    return {
      items: result,
      page: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results
    }
  }

  private async searchMovieById(
    id: string
  ): Promise<ISelectedTargetItem | null> {
    const { data } = await axios.get<{
      title: string
      genres: { id: number }[]
      release_date?: string
      poster_path: string
    }>(`https://api.themoviedb.org/3/movie/${id}`, {
      headers: {
        Authorization: `Bearer ${env.NEXT_PUBLIC_MOVIE_DB_API_KEY}`
      },
      params: {
        language: 'ru-RU'
      }
    })

    if (!data) {
      return null
    }

    const title = data.title
    const genres = data.genres
      .map(({ id }) => this.getMovieGenreName(id))
      .filter(isDefined)
    const releaseDate = data.release_date
    const coverUrl = data.poster_path
      ? `https://image.tmdb.org/t/p/w342${data.poster_path}`
      : undefined

    const description = this.joinDescription([
      ...genres,
      releaseDate ? dayjs(releaseDate).format('YYYY') : ''
    ])

    return {
      externalId: id,
      type: ContentType.MOVIE,
      title,
      coverUrl,
      description
    }
  }

  private async searchTv(query: string, page: number): Promise<ISearchResult> {
    const { data } = await axios.get<{
      results: ITvTargetItem[]
      page: number
      total_pages: number
      total_results: number
    }>(`https://api.themoviedb.org/3/search/tv`, {
      headers: {
        Authorization: `Bearer ${env.NEXT_PUBLIC_MOVIE_DB_API_KEY}`
      },
      params: {
        query,
        language: 'ru-RU',
        page,
        include_adult: true
      }
    })

    if (data.total_results === 0) {
      return {
        items: [],
        page,
        totalPages: 1,
        totalResults: 0
      }
    }

    const result: ITargetItem[] = data.results.map((item) => {
      const title = item.name
      const genres = item.genre_ids
        .map((id) => this.getTvGenreName(id))
        .filter(isDefined)
      const releaseDate = item.first_air_date
      const cover = item.poster_path
        ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
        : undefined

      const description = this.joinDescription([
        ...genres,
        releaseDate ? dayjs(releaseDate).format('YYYY') : ''
      ])

      return {
        id: String(item.id),
        title,
        description,
        cover,
        releaseDate
      }
    })

    return {
      items: result,
      page: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results
    }
  }

  private async searchTvById(id: string): Promise<ISelectedTargetItem | null> {
    const { data } = await axios.get<{
      name: string
      genres: { id: number }[]
      first_air_date?: string
      poster_path: string
    }>(`https://api.themoviedb.org/3/tv/${id}`, {
      headers: {
        Authorization: `Bearer ${env.NEXT_PUBLIC_MOVIE_DB_API_KEY}`
      },
      params: {
        language: 'ru-RU'
      }
    })

    if (!data) {
      return null
    }

    const title = data.name
    const genres = data.genres
      .map(({ id }) => this.getTvGenreName(id))
      .filter(isDefined)
    const releaseDate = data.first_air_date
    const coverUrl = data.poster_path
      ? `https://image.tmdb.org/t/p/w342${data.poster_path}`
      : undefined

    const description = this.joinDescription([
      ...genres,
      releaseDate ? dayjs(releaseDate).format('YYYY') : ''
    ])

    return {
      externalId: id,
      type: ContentType.MOVIE,
      title,
      coverUrl,
      description
    }
  }

  private async searchSongs(
    query: string,
    page: number
  ): Promise<ISearchResult> {
    const { data } = await axios.get<{
      data: ISongTargetItem[]
      total: number
    }>('/api/deezer/search/song', {
      params: {
        q: query,
        limit: LIMIT_PER_PAGE,
        index: (page - 1) * LIMIT_PER_PAGE
      }
    })

    if (data.total === 0) {
      return {
        items: [],
        page,
        totalPages: 1,
        totalResults: 0
      }
    }

    const songs = data.data.filter((album) => album.type === 'track')

    const transformedData: ITargetItem[] = songs.map((track) => ({
      id: String(track.id),
      title: track.title,
      description: track.artist.name,
      cover: track.album.cover_big
    }))

    return {
      items: transformedData,
      page: page + 1,
      totalPages: getPages(data.total),
      totalResults: data.total
    }
  }

  private async searchSongById(
    id: string
  ): Promise<ISelectedTargetItem | null> {
    console.debug('WINDOW', typeof window)

    const { data } = await axios.get<{
      title: string
      album: { cover_big: string }
      artist: { name: string }
      release_date: string
    }>(`/api/deezer/search/song/${id}`)

    if (!data) {
      return null
    }

    const description = this.joinDescription([
      data.artist.name,
      data.release_date ? dayjs(data.release_date).format('YYYY') : ''
    ])

    return {
      externalId: id,
      type: ContentType.SONG,
      title: data.title,
      coverUrl: data.album.cover_big,
      description
    }
  }

  private async searchAlbums(
    query: string,
    page: number
  ): Promise<ISearchResult> {
    const { data } = await axios.get<{
      data: IAlbumTargetItem[]
      total: number
    }>('/api/deezer/search/album', {
      params: {
        q: query,
        limit: LIMIT_PER_PAGE,
        index: (page - 1) * LIMIT_PER_PAGE
      }
    })

    if (data.total === 0) {
      return {
        items: [],
        page,
        totalPages: 1,
        totalResults: 0
      }
    }

    const albums = data.data.filter((album) => album.type === 'album')

    const transformedData: ITargetItem[] = albums.map((album) => ({
      id: String(album.id),
      title: album.title,
      description: album.artist.name,
      cover: album.cover_big
    }))

    return {
      items: transformedData,
      page: page + 1,
      totalPages: getPages(data.total),
      totalResults: data.total
    }
  }

  private async searchAlbumById(
    id: string
  ): Promise<ISelectedTargetItem | null> {
    const { data } = await axios.get<{
      title: string
      cover_big: string
      artist: { name: string }
      release_date: string
    }>(`${env.NEXT_PUBLIC_SITE_URL}/api/deezer/search/album/${id}`)

    if (!data) {
      return null
    }

    const description = `${data.artist.name} • ${dayjs(data.release_date).format('YYYY')}`

    return {
      externalId: id,
      type: ContentType.ALBUM,
      title: data.title,
      coverUrl: data.cover_big,
      description
    }
  }

  private async searchGames(
    query: string,
    page: number
  ): Promise<ISearchResult> {
    const { data } = await axios.get<{
      results: IGameTargetItem[]
      count: number
    }>('https://api.rawg.io/api/games?search', {
      params: {
        search: query,
        key: env.NEXT_PUBLIC_RAWG_API_KEY,
        page
      }
    })

    if (data.count === 0) {
      return {
        items: [],
        page,
        totalPages: 1,
        totalResults: 0
      }
    }

    const transformedData: ITargetItem[] = data.results.map((game) => {
      const genres = game.genres?.map((genre) => genre.name) ?? []

      const description = this.joinDescription([
        ...genres,
        game.released ? dayjs(game.released).format('YYYY') : ''
      ])

      return {
        id: String(game.id),
        title: game.name,
        description,
        cover: game.background_image
      }
    })

    return {
      items: transformedData,
      page: page + 1,
      totalPages: getPages(data.count),
      totalResults: data.count
    }
  }

  private async searchGameById(
    id: string
  ): Promise<ISelectedTargetItem | null> {
    const { data } = await axios.get<{
      name: string
      background_image: string
      genres: { name: string }[]
      released: string
    }>(`https://api.rawg.io/api/games/${id}`, {
      params: {
        key: env.NEXT_PUBLIC_RAWG_API_KEY
      }
    })

    if (!data) {
      return null
    }

    const genres = data.genres?.map((genre) => genre.name) ?? []

    const description = this.joinDescription([
      ...genres,
      data.released ? dayjs(data.released).format('YYYY') : ''
    ])

    return {
      externalId: id,
      type: ContentType.GAME,
      title: data.name,
      coverUrl: data.background_image,
      description
    }
  }

  private async searchBooks(
    query: string,
    page: number
  ): Promise<ISearchResult> {
    const { data } = await axios.get<{
      items?: IBookTargetItem[]
      totalItems: number
    }>('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: query,
        maxResults: LIMIT_PER_PAGE,
        startIndex: (page - 1) * LIMIT_PER_PAGE
      }
    })

    if (!data.items || data.totalItems === 0) {
      return {
        items: [],
        page,
        totalPages: 0,
        totalResults: 0
      }
    }

    const transformedData: ITargetItem[] = data.items.map((book) => {
      const { title, authors = [], publishedDate, imageLinks } = book.volumeInfo

      const description = this.joinDescription([
        ...authors,
        publishedDate ? dayjs(publishedDate).format('YYYY') : ''
      ])

      return {
        id: book.id,
        title,
        description,
        cover: imageLinks?.thumbnail ?? undefined
      }
    })

    return {
      items: transformedData,
      page: page + 1,
      totalPages: getPages(data.totalItems),
      totalResults: data.totalItems
    }
  }

  private async searchBookById(
    id: string
  ): Promise<ISelectedTargetItem | null> {
    const { data } = await axios.get<{
      volumeInfo: {
        title: string
        imageLinks: { thumbnail: string }
        authors: string[]
        publishedDate: string
      }
    }>(`https://www.googleapis.com/books/v1/volumes/${id}`)

    if (!data) {
      return null
    }

    const { title, authors = [], publishedDate, imageLinks } = data.volumeInfo

    const description = this.joinDescription([
      ...authors,
      publishedDate ? dayjs(publishedDate).format('YYYY') : ''
    ])

    return {
      externalId: id,
      type: ContentType.BOOK,
      title,
      coverUrl: imageLinks?.thumbnail,
      description
    }
  }

  private joinDescription(arr: string[]) {
    return arr.filter(Boolean).join(' • ')
  }

  private getMovieGenreName(id: number) {
    return {
      28: 'Боевик',
      12: 'Приключения',
      16: 'Анимация',
      35: 'Комедия',
      80: 'Криминал',
      99: 'Документальный фильм',
      18: 'Драма',
      10751: 'Семейный',
      14: 'Фэнтези',
      36: 'Исторический',
      27: 'Ужасы',
      10402: 'Музыка',
      9648: 'Мистика',
      10749: 'Мелодрама',
      878: 'Научная фантастика',
      10770: 'Телевизионный фильм',
      53: 'Триллер',
      10752: 'Военный',
      37: 'Вестерн'
    }[id]
  }

  private getTvGenreName(id: number) {
    return {
      10759: 'Боевик и приключения',
      16: 'Анимация',
      35: 'Комедия',
      80: 'Криминал',
      99: 'Документальный фильм',
      18: 'Драма',
      10751: 'Семейный',
      10762: 'Детский',
      9648: 'Мистика',
      10763: 'Новости',
      10764: 'Реалити-шоу',
      10765: 'Фантастика и фэнтези',
      10766: 'Мыльная опера',
      10767: 'Ток-шоу',
      10768: 'Военный и политика',
      37: 'Вестерн'
    }[id]
  }
}
