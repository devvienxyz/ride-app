import { useState, useEffect } from "react"
import axiosInstance from "@/axios";
import { Sidebar, LoaderSidebar } from "@components/ui"
import { StatusFilterOptions } from "@/constants"
import RideEditForm from "./update-form";

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
  const [isEditing, setIsEditing] = useState(false);

  const handleRenderEdit = async () => {
    setIsEditing(true)
  }

  const handleDelete = async () => {
    // TODO: prompt dialog -- Please confirm bla bla bla
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

  if (isEditing) return <>
    <Sidebar onClose={onClose}>
      <RideEditForm currentValues={details} rideId={rideId} setIsEditing={setIsEditing} />
    </Sidebar>
  </>

  return (
    <Sidebar onClose={onClose}>
      <div className="flex flex-col h-full justify-start gap-6">
        <DetailItem label="Ride ID">
          <p>{details.id_ride}</p>
        </DetailItem>

        <DetailItem label="Status">
          <p>{StatusFilterOptions[details.status]}</p>
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

        <DetailItem label="Ride Events Today">
          <ul className="overflow-auto max-h-64">
            {details.todays_ride_events?.map(event => (
              <li key={event.id_ride_event}>
                {new Date(event.created_at).toLocaleString()}: {event.description}
              </li>
            ))}
          </ul>
          {!details?.todays_ride_events?.length && "None"}
        </DetailItem>

        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-6 md:px-24 lg:px-20">
          <button onClick={handleRenderEdit} className="py-2 px-4 md:w-full text-gray-800 text-md border rounded-md border-slate-900 bg-transparent hover:border-slate-500 hover:bg-slate-500 hover:text-white">Edit</button>
          <button onClick={handleDelete} className="py-2 px-4 md:w-full text-gray-800 text-md border rounded-md border-slate-900 bg-transparent hover:border-red-300 hover:bg-red-400 hover:text-white">Delete</button>
        </div>
      </div>
    </Sidebar>
  );
}