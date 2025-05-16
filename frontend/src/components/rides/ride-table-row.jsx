import { TableCell, TableRow } from "@components/ui";

export default function RideTableRow({ ride, onClick }) {
  const {
    status,
    id_rider,
    id_driver,
    pickup_latitude,
    pickup_longitude,
    dropoff_latitude,
    dropoff_longitude,
    pickup_time,
  } = ride;

  return (
    <TableRow onClick={() => onClick(ride)}>
      <TableCell firstCell>{status}</TableCell>
      <TableCell>{id_rider?.email}</TableCell>
      <TableCell>{id_driver?.email}</TableCell>
      <TableCell>{pickup_latitude}, {pickup_longitude}</TableCell>
      <TableCell>{dropoff_latitude}, {dropoff_longitude}</TableCell>
      <TableCell>{pickup_time}</TableCell>
    </TableRow>
  );
}
