import { addToast } from '@heroui/toast'
import { api } from '~/trpc/react'

export const useDeleteWishlistItem = (onClose: () => void) => {
  const utils = api.useUtils()
  const { mutateAsync, isPending: isDeleting } =
    api.wishlist.delete.useMutation({
      onSuccess: (_data, variables) => {
        utils.wishlist.getAll.setData(undefined, (oldData) => {
          if (!oldData) return
          return oldData.filter((item) => item.id !== variables.id)
        })
      }
    })

  const handleDelete = async (id: string) => {
    try {
      await mutateAsync({ id })

      addToast({
        title: 'Успешно',
        description: 'Объект удален из ожиданий'
      })
      onClose()
    } catch (error) {
      console.error('Error deleting wishlist item:', error)

      addToast({
        title: 'Ошибка',
        description: 'Не удалось удалить объект из ожиданий',
        color: 'danger'
      })
    }
  }

  return {
    isDeleting,
    handleDelete
  }
}
