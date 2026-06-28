import {
  BookIcon,
  BookmarkIcon,
  CircleDashedIcon,
  ClockIcon,
  StarIcon,
  TrophyIcon
} from 'lucide-react'
import { ROUTES } from './routes'

export const NAV_LINKS = [
  {
    href: ROUTES.REVIEWS,
    label: 'Отзывы',
    icon: BookIcon
  },
  {
    href: ROUTES.TIMELINE,
    label: 'Таймлайн',
    icon: ClockIcon
  },
  {
    href: ROUTES.RANKING_LIST,
    label: 'Рейтинги',
    icon: TrophyIcon
  },
  {
    href: ROUTES.WISHLIST,
    label: 'Ожидания',
    icon: BookmarkIcon
  },
  {
    href: ROUTES.WHEEL,
    label: 'Колесо',
    icon: CircleDashedIcon
  },
  {
    href: ROUTES.RATE,
    label: 'Оценить',
    icon: StarIcon
  }
] as const
