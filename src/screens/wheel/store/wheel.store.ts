import z from 'zod'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEFAULT_DURATION = '5'

const COLORS = [
  '#7F77DD',
  '#1D9E75',
  '#D85A30',
  '#D4537E',
  '#378ADD',
  '#639922',
  '#BA7517',
  '#E24B4A',
  '#888780'
] as const

const slotSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    status: z.union([z.literal('active'), z.literal('inactive')]),
    color: z.enum(COLORS)
  })
)

export type Slot = z.infer<typeof slotSchema>[number]
export type WheelMode = 'normal' | 'elimination'

interface State {
  slots: Slot[]
  mode: WheelMode
  hideEliminatedSlots: boolean
  isSpinning: boolean
  duration: string
  rotation: number
  fallenSlotId: string | null
  winnerSlotId: string | null
}

interface Actions {
  setMode: (mode: WheelMode) => void
  setHideEliminatedSlots: (show: boolean) => void
  addSlot: (name: string) => void
  removeSlot: (id: string) => void
  updateName: (id: string, name: string) => void
  updateStatus: (id: string, status: Slot['status']) => void
  clearSlots: () => void
  setIsSpinning: (isSpinning: boolean) => void
  setDuration: (duration: string) => void
  setRotation: (rotation: number) => void
  setFallenSlotId: (fallenSlotId: string | null) => void
  clearFallenSlot: () => void
  setWinnerSlotId: (winnerSlotId: string | null) => void
  clearWinnerSlot: () => void
  resetStatus: () => void
}

type Store = State & Actions

export const useWheelStore = create<Store>()(
  persist(
    (set) => ({
      slots: [],
      mode: 'normal',
      hideEliminatedSlots: false,
      isSpinning: false,
      duration: DEFAULT_DURATION,
      rotation: 0,
      fallenSlotId: null,
      winnerSlotId: null,

      setMode: (mode) => set({ mode }),
      setHideEliminatedSlots: (hide) => set({ hideEliminatedSlots: hide }),
      resetStatus: () => {
        set((state) => {
          const slots = state.slots.map((slot) => ({
            ...slot,
            status: 'active' as const
          }))
          return { slots, fallenSlotId: null, winnerSlotId: null }
        })
      },
      addSlot: (name) => {
        set((state) => {
          const slots = [...state.slots]
          const id = crypto.randomUUID()
          const color = COLORS[slots.length % COLORS.length] ?? COLORS[0]
          slots.push({ id, name, color, status: 'active' })
          return { slots }
        })
      },
      removeSlot: (id) => {
        set((state) => {
          const slots = state.slots.filter((slot) => slot.id !== id)
          return { slots }
        })
      },
      updateName: (id, name) => {
        set((state) => {
          const slots = state.slots.map((slot) => {
            if (slot.id === id) {
              return { ...slot, name }
            }
            return slot
          })
          return { slots }
        })
      },
      updateStatus: (id, status) => {
        set((state) => {
          const slots = state.slots.map((slot) => {
            if (slot.id === id) {
              return { ...slot, status }
            }
            return slot
          })
          return { slots }
        })
      },
      clearSlots: () => {
        set({ slots: [] })
      },
      setIsSpinning: (isSpinning) => set({ isSpinning }),
      setDuration: (duration) => set({ duration }),
      setRotation: (rotation) => set({ rotation }),
      setFallenSlotId: (fallenSlotId) => set({ fallenSlotId }),
      clearFallenSlot: () => set({ fallenSlotId: null }),
      setWinnerSlotId: (winnerSlotId) => set({ winnerSlotId }),
      clearWinnerSlot: () => set({ winnerSlotId: null })
    }),
    {
      name: 'wheel-store',
      partialize: (state) => {
        const validatedSlots = slotSchema.safeParse(state.slots)
        const validatedDuration = z
          .string()
          .transform((val) => parseInt(val))
          .pipe(z.number().positive())
          .safeParse(state.duration)

        const slots = validatedSlots.success ? validatedSlots.data : []
        const duration = validatedDuration.success
          ? String(validatedDuration.data)
          : '5'

        return {
          slots,
          duration
        }
      }
    }
  )
)
