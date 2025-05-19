import { useEffect, useState, useCallback } from "react";
import useStore from "@/store"
import axiosInstance from "@/axios"
import { StatusFilterOptions } from "@/constants";
import { Table } from "@components/ui";
import { DetailSidebar } from "./detail"
import RideTableRow from "./ride-table-row";

const RideTableHeaders = [
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
  const [filterEmail, setFilterEmail] = useState("");
  const [filterStatus, setFilterStatus] = useState([]);

  const buildParams = (extra = {}) => {
    const params = {}

    if (filterStatus.length && filterStatus.length < Object.keys(StatusFilterOptions).length) {
      params.status = filterStatus.join(",")
    }

    if (filterEmail) params.rider_email = filterEmail;

    return { ...params, ...extra }
  };

  const fetchRides = useCallback(async (params = {}) => {
    try {
      const { data } = await axiosInstance.get("/rides/", {
        params,
        withCredentials: true,
      });

      setRides({
        count: data?.count || 0,
        next: data?.next || null,
        previous: data?.previous || null,
        results: data?.results || [],
      });
    } catch (err) {
      // TODO: add error handling
    }
  }, [setRides]);

  const onFilter = useCallback(() => {
    fetchRides(buildParams());
  }, [filterEmail, filterStatus, fetchRides]);

  const onPageChange = useCallback((newPageNo) => {
    fetchRides(buildParams({ page: newPageNo }));
  }, [filterEmail, filterStatus, fetchRides]);

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
            filterLabel={"Status"}
            filterOptions={StatusFilterOptions}
            onMultiselectChange={setFilterStatus}
            onFilter={onFilter}
            onSearchInputChange={setFilterEmail}
            onPageChange={onPageChange}
            searchBarCtx={{
              title: "Rides Overview",
              subTitle: "Summary of all rides with route and participant info.",
              searchPlaceholder: "Search rides..."
            }}
            emptyMsg="No rides found."
            resourceName="rides"
            headers={RideTableHeaders}
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