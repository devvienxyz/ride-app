import { useEffect } from "react";
import useStore from "@/store"
import axiosInstance from "@/axios"
import { Table, TableCell, TableRow } from "@components/ui";

const RIDE_TABLE_HEADERS = [
  "Status",
  "Rider",
  "Driver",
  "Pickup Location",
  "Dropoff Location",
  "Pickup Time",
]

function renderTableRow(rowData, rowIdx) {
  const {
    status,
    id_rider,
    id_driver,
    pickup_latitude,
    pickup_longitude,
    dropoff_latitude,
    dropoff_longitude,
    pickup_time,
  } = rowData;

  return (
    <TableRow key={`ride-${rowIdx}`}>
      <TableCell firstCell>{status}</TableCell>
      <TableCell>{id_rider}</TableCell>
      <TableCell>{id_driver}</TableCell>
      <TableCell>
        {pickup_latitude}, {pickup_longitude}
      </TableCell>
      <TableCell>
        {dropoff_latitude}, {dropoff_longitude}
      </TableCell>
      <TableCell>{pickup_time}</TableCell>
    </TableRow>
  )
}

export default function Rides() {
  const { rides, setRides } = useStore((state) => state)

  const onPageChange = (newPageNo) => {
    console.log("newPageNo: ", newPageNo)
  }

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const { data } = await axiosInstance.get("/rides/", { withCredentials: true });
        const ctx = {
          count: data?.count || 0,
          next: data?.next || null,
          previous: data?.previous || null,
          results: data?.results || [],
        }

        setRides(ctx);
      } catch (error) {
        // console.error("Error fetching rides", error);
        // Handle error (show error message)
      }
    };

    fetchRides();
  }, [setRides]);

  return (
    <div className="w-full flex flex-row justify-center self-center">
      <div className="py-6 w-full xl:max-w-2/3 gap-6">
        <div className="">
          <Table
            onPageChange={onPageChange}
            searchBarCtx={{
              title: "Rides Overview",
              subTitle: "A summary of all ride records including status, participants, and route details.",
              searchPlaceholder: "Search rides..."
            }}
            emptyMsg="No rides found."
            resourceName="rides"
            headers={RIDE_TABLE_HEADERS}
            paginationCtx={rides}
            rowRenderer={renderTableRow} />
        </div>
      </div>
    </div>
  )
}
