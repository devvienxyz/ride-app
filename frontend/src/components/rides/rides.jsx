import { useEffect, useState, useCallback } from "react";
import useStore from "@/store"
import axiosInstance from "@/axios"
import { Table } from "@components/ui";
import { DetailSidebar } from "./detail"
import RideTableRow from "./ride-table-row";

const RIDE_TABLE_HEADERS = [
  "Status",
  "Rider",
  "Driver",
  "Pickup Location",
  "Dropoff Location",
  "Pickup Time",
]

export default function Rides() {
  const { rides, setRides } = useStore(state => state);
  const [selectedRide, setSelectedRide] = useState(null);

  const onPageChange = useCallback((newPageNo) => {
    (async () => {
      try {
        const { data } = await axiosInstance.get(`/rides/?page=${newPageNo}`, { withCredentials: true });
        setRides({
          count: data?.count || 0,
          next: data?.next || null,
          previous: data?.previous || null,
          results: data?.results || [],
        });
      } catch (err) {
        // Handle error
      }
    })();
  }, []);

  const handleRideClick = useCallback((ride) => {
    setSelectedRide(ride);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosInstance.get("/rides/", { withCredentials: true });
        setRides({
          count: data?.count || 0,
          next: data?.next || null,
          previous: data?.previous || null,
          results: data?.results || [],
        });
      } catch (err) {
        // Handle error
      }
    })();
  }, [setRides]);

  return (
    <>
      <div className="w-full flex flex-row justify-center self-center">
        <div className="py-6 w-full xl:max-w-2/3 gap-6">
          <Table
            onPageChange={onPageChange}
            searchBarCtx={{
              title: "Rides Overview",
              subTitle: "Summary of all rides with route and participant info.",
              searchPlaceholder: "Search rides..."
            }}
            emptyMsg="No rides found."
            resourceName="rides"
            headers={RIDE_TABLE_HEADERS}
            paginationCtx={rides}
            rowRenderer={(ride, idx) => (
              <RideTableRow key={`ride-${idx}`} ride={ride} onClick={handleRideClick} />
            )}
          />
        </div>
      </div>

      {selectedRide && (
        <DetailSidebar
          rideId={selectedRide.id_ride}
          onClose={() => setSelectedRide(null)}
        />
      )}
    </>
  );
}