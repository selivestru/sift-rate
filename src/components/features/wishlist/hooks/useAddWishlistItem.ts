import { addToast } from '@heroui/toast'
import type { ContentType } from '~/generated/prisma'
import { api } from '~/trpc/react'

interface IHandleAddParams {
  externalId: string
  title: string
  coverUrl?: string
  type: ContentType
}

export const useAddWishlistItem = () => {
  const utils = api.useUtils()
  const { mutateAsync, isPending: isAdding } = api.wishlist.add.useMutation()

  const handleAdd = async (data: IHandleAddParams) => {
    try {
      await mutateAsync(data)
      await utils.wishlist.getAll.invalidate()

      addToast({
        title: 'Успешно',
        description: 'Объект добавлен в ожидания'
      })
    } catch (error) {
      console.error('Error adding wishlist item:', error)

      addToast({
        title: 'Ошибка',
        description:
          error instanceof Error
            ? error.message
            : 'Не удалось добавить объект в ожидания',
        color: 'danger'
      })
    }
  }

  return {
    isAdding,
    handleAdd
  }
}
