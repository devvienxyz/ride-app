WITH RideDurations AS (
    SELECT
        r.id_ride,
        r.id_rider_id,
        r.id_driver_id,
        MAX(CASE WHEN re.description = 'Status changed to pickup' THEN re.created_at END) AS pickup_time,
        MAX(CASE WHEN re.description = 'Status changed to dropoff' THEN re.created_at END) AS dropoff_time
    FROM
        ride_ride AS r
    JOIN
        ride_rideevent AS re ON r.id_ride = re.id_ride_id
    WHERE
        re.description IN ('Status changed to pickup', 'Status changed to dropoff')
    GROUP BY
        r.id_ride, r.id_rider_id, r.id_driver_id
    HAVING
        MAX(CASE WHEN re.description = 'Status changed to pickup' THEN re.created_at END) IS NOT NULL AND
        MAX(CASE WHEN re.description = 'Status changed to dropoff' THEN re.created_at END) IS NOT NULL
),
FilteredLongTrips AS (
    SELECT
        rd.id_ride,
        rd.id_rider_id,
        rd.id_driver_id,
        rd.pickup_time,
        rd.dropoff_time,
        EXTRACT(EPOCH FROM (rd.dropoff_time - rd.pickup_time)) / 3600.0 AS trip_duration_hours
    FROM
        RideDurations AS rd
    WHERE
        (rd.dropoff_time - rd.pickup_time) > INTERVAL '1 hour'
)
SELECT
    flt.id_ride,
    flt.id_rider_id AS rider_id,
    u_rider.email AS rider_email, -- Changed to email
    flt.id_driver_id AS driver_id,
    u_driver.email AS driver_email, -- Changed to email
    TO_CHAR(flt.pickup_time, 'YYYY-MM-DD HH24:MI:SS') AS pickup_time,
    TO_CHAR(flt.dropoff_time, 'YYYY-MM-DD HH24:MI:SS') AS dropoff_time,
    TRUNC(flt.trip_duration_hours, 2) AS duration_hours
FROM
    FilteredLongTrips AS flt
JOIN
    users_user AS u_driver ON flt.id_driver_id = u_driver.id_user
JOIN
    users_user AS u_rider ON flt.id_rider_id = u_rider.id_user
ORDER BY
    flt.pickup_time, flt.id_ride;