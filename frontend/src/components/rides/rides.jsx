import { useEffect, useState, useCallback } from "react";
import useStore from "@/store"
import axiosInstance from "@/axios"
import { StatusFilterOptions } from "@/constants";
import { Table, SingleSelectOnDropdown } from "@components/ui";
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
  const [sortOption, setSortOption] = useState("pickup_time");

  const buildParams = useCallback(() => {
    const params = {};

    if (filterStatus.length && filterStatus.length < Object.keys(StatusFilterOptions).length) {
      params.status = filterStatus.join(",");
    }

    if (filterEmail) {
      params.rider_email = filterEmail;
    }

    // Always include sortOption in the parameters
    if (sortOption) {
      params.sort = sortOption;
    }

    return params;
  }, [filterStatus, filterEmail, sortOption]); // Dependencies for useCallback

  const fetchRides = useCallback(async (extraParams = {}) => {
    try {
      const params = { ...buildParams(), ...extraParams }; // Combine base params with any extra
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
      // console.error("Failed to fetch rides:", err);
      // TODO: Implement user-facing error notification
    }
  }, [buildParams, setRides]); // Dependencies for useCallback

  // Consolidate all data fetching into a single useEffect
  useEffect(() => {
    // This effect will run on initial mount and whenever filterEmail, filterStatus, or sortOption changes.
    fetchRides();
  }, [fetchRides]); // fetchRides is a useCallback, so it's stable unless its own dependencies change

  const onFilter = useCallback(() => {
    // No need to pass params here, fetchRides will use the latest state via buildParams
    fetchRides();
  }, [fetchRides]);

  const onPageChange = useCallback((newPageNo) => {
    fetchRides({ page: newPageNo });
  }, [fetchRides]);

  const handleRideClick = useCallback((ride) => {
    setSelectedRide(ride);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortOption(e.target.value);
  }, []);

  const SortField = () => {
    return (
      <div className="flex flex-col">
        <SingleSelectOnDropdown
          name="sort"
          options={{
            "distance_to_pickup": "Distance",
            "-distance_to_pickup": "(Desc) Distance",
            "pickup_time": "Pickup Time",
            "-pickup_time": "(Desc) Pickup Time",
            "distance_to_pickup,pickup_time": "Distance + Pickup Time",
          }}
          label={"Sort by"}
          handleChange={handleSortChange}
          currentValue={sortOption}
        />
      </div>
    )
  }

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
              searchPlaceholder: "Search rider email..."
            }}
            emptyMsg="No rides found."
            resourceName="rides"
            headers={RideTableHeaders}
            paginationCtx={rides}
            rowRenderer={(ride, idx) => (
              <RideTableRow key={`ride-${idx}`} ride={ride} onClick={handleRideClick} />
            )}
            SortComponent={SortField}
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
