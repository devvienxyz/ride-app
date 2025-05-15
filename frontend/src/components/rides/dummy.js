function dummyRideListGenerator(count = 22) {
  return Array.from({ length: count }).map((_, idx) => {
    return (
      {
        "id_ride": idx++,
        "status": "pickup",
        "id_rider": 101,
        "id_driver": 201,
        "pickup_latitude": 40.712776,
        "pickup_longitude": -74.005974,
        "dropoff_latitude": 40.73061,
        "dropoff_longitude": -73.935242,
        "pickup_time": "2025-05-13T09:30:00Z"
      }
    )
  })
}

function dummyRideEventListGenerator(count = 43) {
  return Array.from({ length: count }).map((_, idx) => {
    return (
      {
        "id_ride_event": idx + 1,
        "id_ride": 1,
        "description": "Driver arrived at pickup location.",
        "created_at": "2025-05-13T09:25:00Z",
      }
    )
  })
}

const DUMMY_RIDES = {
  "count": 22,
  "previous": null,
  "next": null,
  "results": dummyRideListGenerator(22)
}

const DUMMY_RIDE_EVENTS = {
  "count": 43,
  "previous": null,
  "next": null,
  "results": dummyRideEventListGenerator(43)
}

export { DUMMY_RIDES, DUMMY_RIDE_EVENTS }