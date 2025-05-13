import useStore from "@/store"

export default function Rides() {
  const { rides, setRides } = useStore((state) => state)

  return (
    <div>
      <h1>List of rides</h1>
    </div>
  )
}
