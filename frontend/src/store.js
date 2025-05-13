import { create } from "zustand"
import { persist } from "zustand/middleware"

const initialState = {
  user: null,
  rides: [],
}

const useStore = create(
  persist(
    (set) => ({
      ...initialState,
      setUser: (user) => set({ user }),
      logout: () => set(initialState),
      setRides: (rides) => set({ rides }),
    }),
    {}
  )
)

export default useStore
export { initialState }