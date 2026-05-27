import {
  BookOpenIcon,
  Disc3Icon,
  FilmIcon,
  Gamepad2Icon,
  MusicIcon,
  TvIcon,
  type LucideIcon
} from 'lucide-react'
import Link from 'next/link'
import type { ContentType } from '~/generated/prisma'

interface ICategoryItem {
  category: ContentType
  title: string
  icon: LucideIcon
}

const CATEGORIES: ICategoryItem[] = [
  {
    category: 'MOVIE',
    title: 'Фильм',
    icon: FilmIcon
  },
  {
    category: 'TV',
    title: 'Сериал',
    icon: TvIcon
  },
  {
    category: 'SONG',
    title: 'Песня',
    icon: MusicIcon
  },
  {
    category: 'ALBUM',
    title: 'Альбом',
    icon: Disc3Icon
  },
  {
    category: 'GAME',
    title: 'Игра',
    icon: Gamepad2Icon
  },
  {
    category: 'BOOK',
    title: 'Книга',
    icon: BookOpenIcon
  }
]

export const SelectCategory = () => {
  return (
    <>
      <p className='text-muted-foreground mb-4'>Выберите категорию</p>
      <div className='grid grid-cols-2 gap-3'>
        {CATEGORIES.map(({ category, title, icon: Icon }) => (
          <Link
            key={category}
            href={`/rate/${category.toLowerCase()}`}
            className='bg-card-background border-border hover:border-secondary hover:bg-secondary/5 group z-px relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border p-6 transition-all'>
            <div className='bg-muted text-muted-foreground group-hover:text-secondary grid size-14 place-items-center rounded-full transition-colors'>
              <Icon className='size-7' />
            </div>
            <span className='font-medium'>{title}</span>
          </Link>
        ))}
      </div>
    </>
  )
}
