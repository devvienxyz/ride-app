import json
import os
import random
from datetime import timedelta
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from django.utils import timezone

# --- Configuration ---
NUM_RIDES = 50
NUM_LONG_TRIPS = 5  # Number of guaranteed long trips (duration > 1 hour)
OUTPUT_DIR = "ride/fixtures"

# Ride Status Choices from your models.py
STATUS_CHOICES = [
    "requested",
    "assigned",
    "en-route",
    "pickup",
    "in-progress",
    "dropoff",
    "completed",
    "cancelled",
    "failed",
]

# Define plausible status transitions for generating realistic events
STATUS_TRANSITIONS = {
    "requested": ["assigned", "cancelled", "failed"],
    "assigned": ["en-route", "cancelled", "failed"],
    "en-route": ["pickup", "cancelled", "failed"],
    "pickup": ["in-progress", "cancelled", "failed"],
    "in-progress": ["dropoff", "cancelled", "failed"],
    "dropoff": ["completed", "cancelled", "failed"],
    "completed": [],  # Terminal status
    "cancelled": [],  # Terminal status
    "failed": [],  # Terminal status
}

# --- Helper Functions ---


def generate_random_coords():
    """Generates random latitude and longitude within a plausible range (e.g., a city area)."""
    # Example: San Francisco Bay Area coordinates
    lat = random.uniform(37.6, 37.9)
    lon = random.uniform(-122.5, -122.1)
    return round(lat, 6), round(lon, 6)


def generate_random_datetime(start_date, end_date):
    """
    Generates a random timezone-aware datetime between two dates.
    The input start_date and end_date are expected to be timezone-aware.
    """
    time_delta = end_date - start_date
    random_seconds = random.uniform(0, time_delta.total_seconds())
    return start_date + timedelta(seconds=random_seconds)


def generate_ride_data(ride_pk, rider_pk, driver_pk, status_override=None):
    """Generates data for a single Ride instance."""
    pickup_lat, pickup_lon = generate_random_coords()
    dropoff_lat, dropoff_lon = generate_random_coords()

    # Ensure dropoff is not exactly the same as pickup for realism
    while dropoff_lat == pickup_lat and dropoff_lon == pickup_lon:
        dropoff_lat, dropoff_lon = generate_random_coords()

    # Generate pickup time within the last 30 days
    end_time = timezone.now()
    start_time = end_time - timedelta(days=30)
    pickup_time = generate_random_datetime(start_time, end_time)

    return {
        "model": "ride.ride",
        "pk": ride_pk,
        "fields": {
            "status": status_override if status_override else random.choice(STATUS_CHOICES),
            "id_rider": rider_pk,
            "id_driver": driver_pk,
            "pickup_latitude": pickup_lat,
            "pickup_longitude": pickup_lon,
            "dropoff_latitude": dropoff_lat,
            "dropoff_longitude": dropoff_lon,
            "pickup_time": pickup_time.isoformat(),
        },
    }


def generate_ride_event_data(event_pk, ride_pk, description, created_at):
    """Generates data for a single RideEvent instance with a specific description and time."""
    return {
        "model": "ride.rideevent",
        "pk": event_pk,
        "fields": {
            "id_ride_id": ride_pk,
            "description": description,
            "created_at": created_at.isoformat(),
        },
    }


# --- Django Management Command Class ---


class Command(BaseCommand):
    help = "Generates ride and ride event fixture data into ride/fixtures/00_rides.json and 01_ride_events.json"

    def handle(self, *args, **options):
        os.makedirs(OUTPUT_DIR, exist_ok=True)

        User = get_user_model()
        user_ids = list(User.objects.values_list("id_user", flat=True))

        if not user_ids:
            raise CommandError(
                "No users found in the database. Please create some users before generating ride fixtures."
            )

        rides_data = []
        ride_events_data = []
        event_pk_counter = 1  # Counter for RideEvent primary keys

        self.stdout.write(self.style.SUCCESS(f"Generating {NUM_RIDES} rides and associated events..."))
        self.stdout.write(self.style.NOTICE(f"Ensuring {NUM_LONG_TRIPS} rides are 'long trips' (> 1 hour duration)."))

        for i in range(NUM_RIDES):
            ride_pk = i + 1

            # Randomly select rider and driver from existing user IDs
            rider_pk = random.choice(user_ids)
            driver_pk = random.choice(user_ids)

            # Ensure rider and driver are different for a ride
            if len(user_ids) > 1:
                while rider_pk == driver_pk:
                    driver_pk = random.choice(user_ids)
            else:
                self.stdout.write(
                    self.style.WARNING("Only one user found. Rider and Driver might be the same for some rides.")
                )

            is_long_trip = i < NUM_LONG_TRIPS  # The first NUM_LONG_TRIPS rides will be long trips

            # For long trips, force the ride status to 'completed' for realism
            ride = generate_ride_data(
                ride_pk, rider_pk, driver_pk, status_override="completed" if is_long_trip else None
            )
            rides_data.append(ride)

            # Get the ride's base pickup time (from ride object, not event)
            base_ride_pickup_time = timezone.datetime.fromisoformat(ride["fields"]["pickup_time"])

            # --- Generate events for this ride ---
            current_event_time = base_ride_pickup_time - timedelta(minutes=random.randint(1, 5))  # Initial event time

            # 1. Generate the initial 'Ride created' event
            event = generate_ride_event_data(
                event_pk_counter, ride_pk, "Ride created with initial status 'requested'", current_event_time
            )
            ride_events_data.append(event)
            event_pk_counter += 1

            if is_long_trip:
                # --- Special handling for guaranteed long trips ---
                # Ensure a realistic flow of events for a completed long trip

                # Assigned event
                current_event_time += timedelta(minutes=random.randint(5, 10))
                event = generate_ride_event_data(
                    event_pk_counter, ride_pk, "Status changed to assigned", current_event_time
                )
                ride_events_data.append(event)
                event_pk_counter += 1

                # En-route event
                current_event_time += timedelta(minutes=random.randint(5, 10))
                event = generate_ride_event_data(
                    event_pk_counter, ride_pk, "Status changed to en-route", current_event_time
                )
                ride_events_data.append(event)
                event_pk_counter += 1

                # Pickup event (Crucial for SQL query)
                pickup_event_time = current_event_time + timedelta(minutes=random.randint(5, 15))
                event = generate_ride_event_data(
                    event_pk_counter, ride_pk, "Status changed to pickup", pickup_event_time
                )
                ride_events_data.append(event)
                event_pk_counter += 1

                # In-progress event
                current_event_time = pickup_event_time + timedelta(minutes=random.randint(10, 20))
                event = generate_ride_event_data(
                    event_pk_counter, ride_pk, "Status changed to in-progress", current_event_time
                )
                ride_events_data.append(event)
                event_pk_counter += 1

                # Dropoff event (Crucial for SQL query - ensure > 1 hour from pickup_event_time)
                dropoff_event_time = pickup_event_time + timedelta(
                    hours=1, minutes=random.randint(5, 45)
                )  # Guaranteed > 1 hour
                event = generate_ride_event_data(
                    event_pk_counter, ride_pk, "Status changed to dropoff", dropoff_event_time
                )
                ride_events_data.append(event)
                event_pk_counter += 1

                # Completed event
                current_event_time = dropoff_event_time + timedelta(minutes=random.randint(5, 15))
                event = generate_ride_event_data(
                    event_pk_counter, ride_pk, "Status changed to completed", current_event_time
                )
                ride_events_data.append(event)
                event_pk_counter += 1

            else:
                # --- Existing logic for random status changes for regular trips ---
                current_status = "requested"
                final_ride_status = ride["fields"]["status"]  # Use the randomly assigned status

                status_path = ["requested"]

                while current_status != final_ride_status and current_status not in [
                    "completed",
                    "cancelled",
                    "failed",
                ]:
                    possible_next_statuses = STATUS_TRANSITIONS.get(current_status, [])

                    if final_ride_status in possible_next_statuses:
                        next_status = final_ride_status
                    elif possible_next_statuses:
                        next_status = random.choice(possible_next_statuses)
                    else:
                        break  # No valid transitions, break

                    if next_status in status_path and next_status != final_ride_status:
                        break  # Avoid infinite loops

                    status_path.append(next_status)

                    current_event_time += timedelta(minutes=random.randint(5, 30))  # Increment time

                    # Ensure specific descriptions for pickup/dropoff for SQL query
                    description = f"Status changed to {next_status}"
                    if next_status == "pickup":
                        description = "Status changed to pickup"
                    elif next_status == "dropoff":
                        description = "Status changed to dropoff"
                    elif next_status == "completed":
                        description = "Status changed to completed"  # Ensure this too

                    event = generate_ride_event_data(event_pk_counter, ride_pk, description, current_event_time)
                    ride_events_data.append(event)
                    event_pk_counter += 1

                    current_status = next_status

                    if current_status in ["completed", "cancelled", "failed"]:
                        break

        # Save rides fixture
        rides_file_path = os.path.join(OUTPUT_DIR, "00_rides.json")
        with open(rides_file_path, "w") as f:
            json.dump(rides_data, f, indent=2)
        self.stdout.write(self.style.SUCCESS(f"Generated {len(rides_data)} rides and saved to {rides_file_path}"))

        # Save ride events fixture
        ride_events_file_path = os.path.join(OUTPUT_DIR, "01_ride_events.json")
        with open(ride_events_file_path, "w") as f:
            json.dump(ride_events_data, f, indent=2)
        self.stdout.write(
            self.style.SUCCESS(f"Generated {len(ride_events_data)} ride events and saved to {ride_events_file_path}")
        )
