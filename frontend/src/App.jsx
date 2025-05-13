import { Routes, Route } from "react-router"
import { Home, Rides, RideDetail, NotFound, ErrorBoundary } from "@pages"
import { RequireAuth } from "@components"
import { Layout } from "@components/ui"

export default function App() {
  return (
    <Layout>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rides" element={<RequireAuth><Rides /></RequireAuth>} />
          <Route path="/rides/:rideId" element={<RequireAuth><RideDetail /></RequireAuth>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </Layout>
  )
}