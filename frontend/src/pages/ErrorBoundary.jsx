export default function ErrorBoundary() {
  const { rides } = useStore((state) => state)
  const { setRides } = useStore((state) => state)

  return (
    <div>
      <h1>Something went wrong.</h1>
    </div>
  )
}
