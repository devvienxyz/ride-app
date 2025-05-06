import { create } from "zustand"

const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
  rides: [],
  setRides: (rides) => set({ rides }),
}))

export default useStore