import { useState, useEffect } from "react"

export function SideDialog({ rideId, onClose }) {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    async function fetchDetails() {
      const res = await fetch(`/api/rides/${rideId}`);
      const data = await res.json();
      setDetails(data);
    }
    fetchDetails();
  }, [rideId]);

  if (!details) return <div className="fixed right-0 top-0 w-80 h-full bg-white shadow p-4">Loading...</div>;

  return (
    <div className="fixed z-2 right-0 top-0 w-full sm:w-2/3 lg:w-1/3 h-full bg-white shadow p-4 pt-12 flex flex-col">
      <button onClick={onClose} className="self-end mb-2">Close</button>
      <h2 className="text-lg font-bold mb-4">Ride #{details.id_ride}</h2>
      <p>Status: {details.status}</p>
      <p>Pickup: {details.pickup_latitude}, {details.pickup_longitude}</p>
      <p>Driver ID: {details.id_driver.email}</p>
      <p>Rider ID: {details.id_rider.email}</p>
      <h3 className="mt-4 font-semibold">Recent Events</h3>
      <ul className="overflow-auto max-h-64">
        {details.todays_ride_events?.map(event => (
          <li key={event.id_ride_event}>
            {new Date(event.created_at).toLocaleString()}: {event.description}
          </li>
        ))}
      </ul>
    </div>
  );
}