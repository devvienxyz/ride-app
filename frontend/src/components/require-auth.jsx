import { Navigate, useLocation } from "react-router"
import useStore from "@/store"

export default function RequireAuth({ children }) {
  const user = useStore((s) => s.user)
  const location = useLocation()

  if (!user) return <Navigate to="/" state={{ from: location }} replace />
  return children
}
