import { useState, useEffect } from "react"
import { Button, Sidebar, LoaderSidebar } from "@components/ui"
import axiosInstance from "@/axios";

function DetailItem({ label, children }) {
  return (
    <div className="">
      <p className="mt-4 font-semibold">{label}</p>
      <div className="text-slate-500">{children}</div>
    </div>
  )
}

export function DetailSidebar({ rideId, onClose }) {
  const [details, setDetails] = useState(null);

  const handleEdit = async () => {
    console.log("edit")
  }

  const handleDelete = async () => {
    console.log("delete")
    const res = await axiosInstance.delete(`/rides/${rideId}/`, { withCredentials: true });

  }

  useEffect(() => {
    async function fetchDetails() {
      const { data } = await axiosInstance.get(`/rides/${rideId}/`, { withCredentials: true });
      setDetails(data);
    }

    fetchDetails();
  }, [rideId]);

  if (!details) return <LoaderSidebar onClose={onClose} />

  return (
    <Sidebar onClose={onClose}>
      <div className="flex flex-col h-full justify-between">
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

        <div className="flex justify-center gap-6">
          <Button onClick={handleEdit} addlClasses="!text-gray-800 text-md border border-slate-900 hover:border-blue-800 hover:bg-blue-800 hover:!text-white bg-transparent">Edit</Button>
          <Button onClick={handleDelete} addlClasses="!text-gray-800 text-md border border-slate-900 hover:border-red-800 hover:bg-red-800 hover:!text-white bg-transparent">Delete</Button>
        </div>
      </div>
    </Sidebar>
  );
}