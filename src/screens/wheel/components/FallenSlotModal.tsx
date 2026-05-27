import { Button } from '@heroui/button'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from '@heroui/modal'
import { Show } from '~/components/ui/show'
import { useWheelStore } from '../store/wheel.store'

export const FallenSlotModal = () => {
  const { slots, mode, fallenSlotId, removeSlot, clearFallenSlot } =
    useWheelStore()

  const fallenSlot = slots.find((slot) => slot.id === fallenSlotId) ?? null

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      clearFallenSlot()
    }
  }

  const onDelete = () => {
    if (!fallenSlot) return

    removeSlot(fallenSlot.id)
    clearFallenSlot()
  }

  return (
    <Modal
      placement='center'
      isOpen={Boolean(fallenSlot)}
      onOpenChange={handleOpenChange}>
      <ModalContent>
        {(closeModal) => (
          <>
            <ModalHeader className='font-roboto-slab text-xl font-bold'>
              {mode === 'normal' ? 'Выиграл лот' : 'Выбывший лот'}
            </ModalHeader>
            <ModalBody>
              <p className='text-2xl font-semibold break-all'>
                {fallenSlot?.name}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color='default'
                variant={mode === 'normal' ? 'light' : 'flat'}
                onPress={() => {
                  closeModal()
                  clearFallenSlot()
                }}>
                Закрыть
              </Button>
              <Show when={mode === 'normal'}>
                <Button color='danger' variant='flat' onPress={onDelete}>
                  Удалить слот
                </Button>
              </Show>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
