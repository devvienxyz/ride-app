import { Routes, Route } from "react-router"
import { Home, Rides, RideDetail, NotFound, ErrorBoundary } from "@pages"
import RequireAuth from "@components/require-auth"

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rides" element={<RequireAuth><Rides /></RequireAuth>} />
        <Route path="/rides/:rideId" element={<RequireAuth><RideDetail /></RequireAuth>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  )
}