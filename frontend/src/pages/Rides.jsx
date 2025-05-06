export default function Rides() {
  const { rides } = useStore((state) => state)
  const { setRides } = useStore((state) => state)

  return (
    <div>
      <h1>List of rides</h1>
    </div>
  )
}
