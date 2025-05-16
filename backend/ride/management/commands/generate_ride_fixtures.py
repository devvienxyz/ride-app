import json
import random
from datetime import datetime, timedelta
from pathlib import Path
from django.core.management.base import BaseCommand
from users.models import User
from django.utils.timezone import make_aware
from ride.utils.location_generator import generate_coordinates


STATUSES = ["en-route", "pickup", "dropoff", "cancelled"]
EVENT_SEQUENCES = {
    "en-route": ["Driver assigned", "En route to pickup"],
    "pickup": ["Driver arrived", "Passenger onboard"],
    "dropoff": ["En route to destination", "Arrived at destination", "Passenger dropped off"],
    "cancelled": ["Driver assigned", "Ride cancelled by rider"],
}


class Command(BaseCommand):
    help = "Generate ride and ride event fixtures"

    def add_arguments(self, parser):
        parser.add_argument("--count", type=int, default=10, help="Number of rides to generate")

    def handle(self, *args, **options):
        ride_count = options["count"]
        riders = list(User.objects.filter(role="rider"))
        drivers = list(User.objects.filter(role="driver"))

        if not riders or not drivers:
            self.stderr.write("❌ No riders or drivers found. Generate user fixtures first.")
            return

        rides = []
        events = []
        ride_id_counter = 1
        event_id_counter = 1

        now = make_aware(datetime.now())

        for i in range(ride_count):
            rider = random.choice(riders)
            driver = random.choice(drivers)
            status = random.choice(STATUSES)
            pickup_time = now - timedelta(minutes=random.randint(10, 120))

            pickup_lat, pickup_lng = generate_coordinates()
            dropoff_lat, dropoff_lng = generate_coordinates()

            ride_obj = {
                "model": "ride.ride",
                "pk": ride_id_counter,
                "fields": {
                    "status": status,
                    "id_rider": rider.pk,
                    "id_driver": driver.pk,
                    "pickup_latitude": pickup_lat,
                    "pickup_longitude": pickup_lng,
                    "dropoff_latitude": dropoff_lat,
                    "dropoff_longitude": dropoff_lng,
                    "pickup_time": pickup_time.isoformat(),
                },
            }
            rides.append(ride_obj)

            # Events based on ride status
            event_descriptions = EVENT_SEQUENCES[status]
            for j, desc in enumerate(event_descriptions):
                event_time = pickup_time + timedelta(minutes=j * 5)
                events.append(
                    {
                        "model": "ride.rideevent",
                        "pk": event_id_counter,
                        "fields": {
                            "id_ride": ride_id_counter,
                            "description": desc,
                            "created_at": event_time.isoformat(),
                        },
                    }
                )
                event_id_counter += 1

            ride_id_counter += 1

        fixtures_dir = Path("ride/fixtures")
        fixtures_dir.mkdir(parents=True, exist_ok=True)

        with open(fixtures_dir / "00_rides.json", "w") as f:
            json.dump(rides, f, indent=2)

        with open(fixtures_dir / "01_ride_events.json", "w") as f:
            json.dump(events, f, indent=2)

        self.stdout.write(self.style.SUCCESS(f"✅ Generated {ride_count} rides and {len(events)} ride events."))
