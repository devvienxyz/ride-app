import { useEffect } from "react";
import axiosInstance from "@/axios.js"
import useStore from "@/store"

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
    <div className="py-6 w-full lg:max-w-1/2 flex flex-row justify-center">
      <h1>List of rides</h1>

      <table>
        <tbody>
          {!rides.length && (
            // TODO: spin when fetching
            // <tr><td colSpan="4"><Spinner /></td></tr>
            <tr><td colSpan="4">Empty</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
