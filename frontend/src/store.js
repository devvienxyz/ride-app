import { create } from "zustand"
import { persist } from "zustand/middleware"

const initialState = {
  user: null,
  rides: {
    "count": 0, "next": null, "previous": null, "results": []
  },
  rideEvents: {
    "count": 0, "next": null, "previous": null, "results": []
  },
}

const useStore = create(
  persist(
    (set) => ({
      ...initialState,
      setUser: (user) => set({ user }),
      logout: () => set(initialState),
      setRides: (rides) => set({ rides }),
      setRideEvents: (rideEvents) => set({ rideEvents }),
    }),
    {}
  )
)

export default useStore
export { initialState }