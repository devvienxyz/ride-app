import { useState, useEffect } from "react"

function DetailItem({ label, children }) {
  return (
    <div className="">
      <p className="mt-4 font-semibold">{label}</p>
      <div className="text-slate-500">{children}</div>
    </div>
  )
}

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

  if (!details) return <div className="fixed z-2 right-0 top-0 w-full sm:w-2/3 lg:w-1/3 xl:max-w-1/4 h-full bg-slate-50 shadow p-8 pt-12 flex flex-col">Loading...</div>;

  return (
    <div className="fixed z-2 right-0 top-0 w-full sm:w-2/3 lg:w-1/3 xl:max-w-1/4 h-full bg-slate-50 shadow p-8 pt-12 flex flex-col text-slate-800">
      <button onClick={onClose} className="text-slate-900 self-end mb-2">Close</button>

      <div className="flex flex-col gap-6">
        <DetailItem label="Ride ID">
          <p>{details.id_ride}</p>
        </DetailItem>

        <DetailItem label="Status">
          <p>{details.status}</p>
        </DetailItem>

        <DetailItem label="Pickup Time">
          <p>{details.pickup_time}</p>
        </DetailItem>

        <DetailItem label="Pickup Location">
          <p>{details.pickup_latitude}, {details.pickup_longitude}</p>
        </DetailItem>

        <DetailItem label="Dropoff Location">
          <p>{details.dropoff_latitude}, {details.dropoff_longitude}</p>
        </DetailItem>

        <DetailItem label="Driver">
          <p>{details.id_driver.first_name} {details.id_driver.last_name}</p>
          <p>{details.id_driver.email}</p>
        </DetailItem>

        <DetailItem label="Rider">
          <p>{details.id_rider.first_name} {details.id_rider.last_name}</p>
          <p>{details.id_rider.email}</p>
        </DetailItem>

        <DetailItem label="Ride Events">
          <ul className="overflow-auto max-h-64">
            {details.todays_ride_events?.map(event => (
              <li key={event.id_ride_event}>
                {new Date(event.created_at).toLocaleString()}: {event.description}
              </li>
            ))}
          </ul>
        </DetailItem>
      </div>
    </div>
  );
}