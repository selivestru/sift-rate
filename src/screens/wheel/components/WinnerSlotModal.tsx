import { Button } from '@heroui/button'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from '@heroui/modal'
import { useWheelStore } from '../store/wheel.store'

export const WinnerSlotModal = () => {
  const { slots, winnerSlotId, clearWinnerSlot } = useWheelStore()

  const winnerSlot = slots.find((slot) => slot.id === winnerSlotId) ?? null

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      clearWinnerSlot()
    }
  }

  return (
    <Modal
      placement='center'
      isOpen={Boolean(winnerSlot)}
      onOpenChange={handleOpenChange}>
      <ModalContent>
        {(closeModal) => (
          <>
            <ModalHeader className='font-roboto-slab text-xl font-bold'>
              Победитель
            </ModalHeader>
            <ModalBody>
              <p className='text-2xl font-semibold break-all'>
                {winnerSlot?.name}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color='primary'
                onPress={() => {
                  closeModal()
                  clearWinnerSlot()
                }}>
                Закрыть
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
