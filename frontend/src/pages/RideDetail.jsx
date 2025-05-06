import { useParams } from "react-router"

export default function RideDetail() {
  const { rideId } = useParams()
  return <h1>Ride Detail: {rideId}</h1>
}
