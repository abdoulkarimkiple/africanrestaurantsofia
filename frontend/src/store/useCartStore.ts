import { create } from 'zustand'

type CartState = {
  itemCount: number
  resetCart: () => void
  setItemCount: (itemCount: number) => void
}

export const useCartStore = create<CartState>((set) => ({
  itemCount: 0,
  resetCart: () => set({ itemCount: 0 }),
  setItemCount: (itemCount) => set({ itemCount }),
}))

