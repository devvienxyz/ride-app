import { useEffect } from "react";
import useStore from "@/store"
import axiosInstance from "@/axios"
import { Table, TableCell, TableRow } from "@components/ui";

const TABLE_HEADERS = [
  "Ride Event ID",
  "Rider ID",
  "Description",
  "Created At",
]

function renderTableRow(rowData, idx) {
  const { description, id_ride, id_ride_event, created_at } = rowData;

  return (
    <TableRow key={`ride-event-${id_ride_event}`}>
      <TableCell>{id_ride_event}</TableCell>
      <TableCell>{id_ride}</TableCell>
      <TableCell>{description}</TableCell>
      <TableCell>{created_at}</TableCell>
    </TableRow>
  )
}

export default function RideEvents() {
  const { rideEvents, setRideEvents } = useStore((state) => state)

  useEffect(() => {
    const fetchRideEvents = async () => {
      try {
        const { data } = await axiosInstance.get("/ride-events/", { withCredentials: true });
        const ctx = {
          count: data?.count || 0,
          next: data?.next || null,
          previous: data?.previous || null,
          results: data?.results || [],
        }
        setRideEvents(ctx);
      } catch (error) {
        // console.error("Error fetching ride events", error);
        // Handle error (show error message)
      }
    };

    fetchRideEvents();
  }, [setRideEvents]);

  return (
    <div className="w-full flex flex-row justify-center self-center">
      <div className="py-6 w-full xl:max-w-2/3 gap-6">
        <div className="flex flex-row justify-center w-full">
          <Table
            searchBarCtx={{
              title: "Ride Events Log",
              subTitle: "Detailed timeline of events associated with each ride, including descriptions and timestamps.",
              searchPlaceholder: "Search ride events..."
            }}
            emptyMsg="No ride events found."
            resourceName="ride-events"
            headers={TABLE_HEADERS}
            paginationCtx={rideEvents}
            rowRenderer={renderTableRow} />
        </div>
      </div>
    </div>
  )
}
