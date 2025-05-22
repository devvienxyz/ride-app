import json
import os
import random
from datetime import timedelta
from django.core.management.base import BaseCommand, CommandError  # Import BaseCommand and CommandError
from django.contrib.auth import get_user_model  # Import get_user_model
from django.utils import timezone  # Import timezone for make_aware

# --- Configuration ---
NUM_RIDES = 50
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
    # Since start_date is already timezone-aware, adding a timedelta will result
    # in another timezone-aware datetime. No need for make_aware here.
    return start_date + timedelta(seconds=random_seconds)


def generate_ride_data(ride_pk, rider_pk, driver_pk):
    """Generates data for a single Ride instance."""
    pickup_lat, pickup_lon = generate_random_coords()
    dropoff_lat, dropoff_lon = generate_random_coords()

    # Ensure dropoff is not exactly the same as pickup for realism
    while dropoff_lat == pickup_lat and dropoff_lon == pickup_lon:
        dropoff_lat, dropoff_lon = generate_random_coords()

    # Generate pickup time within the last 30 days
    end_time = timezone.now()  # Use timezone.now() for timezone-aware current time
    start_time = end_time - timedelta(days=30)
    pickup_time = generate_random_datetime(start_time, end_time)

    return {
        "model": "ride.ride",
        "pk": ride_pk,
        "fields": {
            "status": random.choice(STATUS_CHOICES),  # Final status for the ride
            "id_rider": rider_pk,
            "id_driver": driver_pk,
            "pickup_latitude": pickup_lat,
            "pickup_longitude": pickup_lon,
            "dropoff_latitude": dropoff_lat,
            "dropoff_longitude": dropoff_lon,
            "pickup_time": pickup_time.isoformat(),  # ISO format for DateTimeField
        },
    }


def generate_ride_event_data(event_pk, ride_pk, description, created_at):
    """Generates data for a single RideEvent instance with a specific description and time."""
    return {
        "model": "ride.rideevent",
        "pk": event_pk,
        "fields": {
            "id_ride_id": ride_pk,  # Changed from 'id_ride' to 'id_ride_id' for explicit foreign key
            "description": description,
            "created_at": created_at.isoformat(),  # ISO format for DateTimeField
        },
    }


# --- Django Management Command Class ---


class Command(BaseCommand):
    help = "Generates ride and ride event fixture data into ride/fixtures/00_rides.json and 01_ride_events.json"

    def handle(self, *args, **options):
        os.makedirs(OUTPUT_DIR, exist_ok=True)

        User = get_user_model()
        # Fetch all existing user IDs using 'id_user' as the primary key field
        user_ids = list(User.objects.values_list("id_user", flat=True))

        if not user_ids:
            raise CommandError(
                "No users found in the database. Please create some users before generating ride fixtures."
            )

        rides_data = []
        ride_events_data = []
        event_pk_counter = 1  # Counter for RideEvent primary keys

        self.stdout.write(self.style.SUCCESS(f"Generating {NUM_RIDES} rides and associated events..."))

        for i in range(NUM_RIDES):
            ride_pk = i + 1

            # Randomly select rider and driver from existing user IDs
            rider_pk = random.choice(user_ids)
            driver_pk = random.choice(user_ids)

            # Ensure rider and driver are different for a ride
            if len(user_ids) > 1:  # Only try to find different users if more than one exists
                while rider_pk == driver_pk:
                    driver_pk = random.choice(user_ids)
            else:
                self.stdout.write(
                    self.style.WARNING("Only one user found. Rider and Driver might be the same for some rides.")
                )

            ride = generate_ride_data(ride_pk, rider_pk, driver_pk)
            rides_data.append(ride)

            # Get the ride's pickup time and final status
            # timezone.datetime.fromisoformat will correctly parse the ISO string into a timezone-aware datetime
            ride_pickup_time = timezone.datetime.fromisoformat(ride["fields"]["pickup_time"])
            final_ride_status = ride["fields"]["status"]

            # 1. Generate the initial 'Ride created' event (mimics signal on create)
            initial_event_time = ride_pickup_time - timedelta(minutes=random.randint(1, 5))  # Slightly before pickup
            initial_description = f"Ride created with initial status 'requested'"
            event = generate_ride_event_data(event_pk_counter, ride_pk, initial_description, initial_event_time)
            ride_events_data.append(event)
            event_pk_counter += 1

            # 2. Simulate status changes leading to the final status
            current_status = "requested"
            current_event_time = initial_event_time

            # Keep track of the path taken
            status_path = ["requested"]

            # Loop to transition through statuses until the final status is reached
            while current_status != final_ride_status and current_status not in ["completed", "cancelled", "failed"]:
                possible_next_statuses = STATUS_TRANSITIONS.get(current_status, [])

                # If the final status is directly reachable from current, take it
                if final_ride_status in possible_next_statuses:
                    next_status = final_ride_status
                # If not, and there are other options, pick a random valid transition
                elif possible_next_statuses:
                    next_status = random.choice(possible_next_statuses)
                else:
                    # No valid transitions, break (e.g., if current_status is already terminal)
                    break

                # Ensure we don't loop endlessly if final_ride_status is unreachable
                if next_status in status_path and next_status != final_ride_status:
                    break  # Avoid infinite loops if status graph is complex

                status_path.append(next_status)

                # Generate event for status change
                current_event_time += timedelta(minutes=random.randint(5, 30))  # Increment time
                description = f"Ride status changed from '{current_status}' to '{next_status}'"
                event = generate_ride_event_data(event_pk_counter, ride_pk, description, current_event_time)
                ride_events_data.append(event)
                event_pk_counter += 1

                current_status = next_status

                # If we reached a terminal status, stop generating further events
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
