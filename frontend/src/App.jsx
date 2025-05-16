import { Routes, Route } from "react-router"
import { Home, NotFound, ErrorBoundary } from "@pages"
import { Layout } from "@components/ui"

export default function App() {
  return (
    <Layout>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </Layout>
  )
}
