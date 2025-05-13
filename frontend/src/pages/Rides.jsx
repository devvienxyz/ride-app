import { useEffect } from "react";
import useStore from "@/store"
import axiosInstance from "@/axios"
import { Table } from "@components/ui";

const RIDE_TABLE_HEADERS = [
  "Status",
  "Rider",
  "Driver",
  "Pickup Location",
  "Dropoff Location",
  "Pickup Time",
]

export default function Rides() {
  const { rides, setRides } = useStore((state) => state)

  useEffect(() => {
    // Fetch rides when the component mounts
    const fetchRides = async () => {
      try {
        const response = await axiosInstance.get("/rides/", { withCredentials: true });
        setRides(response.data || []); // Update Zustand state
      } catch (error) {
        // console.error("Error fetching rides", error);
        // Handle error (show error message)
      }
    };

    fetchRides();
  }, [setRides]);

  return (
    <div className="w-full flex flex-row justify-center self-center">
      <div className="py-6 w-full xl:max-w-1/2 gap-6">
        <div className="flex flex-row justify-center w-full">
          <Table headers={RIDE_TABLE_HEADERS} data={rides} />
        </div>
      </div>
    </div>
  )
}
