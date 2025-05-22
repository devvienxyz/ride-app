
WITH RideDurations AS (
    SELECT
        r.id_ride,
        r.id_driver_id, -- <--- CORRECTED: Changed 'r.id_driver' to 'r.id_driver_id'
        MAX(CASE WHEN re.description = 'Status changed to pickup' THEN re.created_at END) AS pickup_time,
        MAX(CASE WHEN re.description = 'Status changed to dropoff' THEN re.created_at END) AS dropoff_time
    FROM
        ride_ride AS r
    JOIN
        ride_rideevent AS re ON r.id_ride = re.id_ride_id
    WHERE
        re.description IN ('Status changed to pickup', 'Status changed to dropoff')
    GROUP BY
        r.id_ride, r.id_driver_id -- <--- CORRECTED: Also needs to be 'id_driver_id' in GROUP BY
    HAVING
        MAX(CASE WHEN re.description = 'Status changed to pickup' THEN re.created_at END) IS NOT NULL AND
        MAX(CASE WHEN re.description = 'Status changed to dropoff' THEN re.created_at END) IS NOT NULL
),
FilteredLongTrips AS (
    SELECT
        rd.id_ride,
        rd.id_driver_id, -- <--- CORRECTED: Changed 'rd.id_driver' to 'rd.id_driver_id'
        rd.pickup_time,
        EXTRACT(EPOCH FROM (rd.dropoff_time - rd.pickup_time)) / 3600.0 AS trip_duration_hours -- Calculate duration in hours
    FROM
        RideDurations AS rd
    WHERE
        (rd.dropoff_time - rd.pickup_time) > INTERVAL '1 hour'
)
SELECT
    TO_CHAR(flt.pickup_time, 'YYYY-MM') AS Month,
    u.first_name || ' ' || u.last_name AS Driver,
    COUNT(flt.id_ride) AS "Count of Trips > 1 hr"
FROM
    FilteredLongTrips AS flt
JOIN
    users_user AS u ON flt.id_driver_id = u.id_user -- <--- CORRECTED: Changed 'flt.id_driver' to 'flt.id_driver_id'
GROUP BY
    Month, Driver
ORDER BY
    Month, Driver;
