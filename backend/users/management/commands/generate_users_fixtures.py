import json
from django.core.management.base import BaseCommand
from users.utils.passwords import hash_password
from pathlib import Path


class Command(BaseCommand):
    help = "Generate user fixtures for riders and drivers"

    def add_arguments(self, parser):
        parser.add_argument("--riders", type=int, default=10, help="Number of rider accounts to generate")
        parser.add_argument("--drivers", type=int, default=10, help="Number of driver accounts to generate")
        parser.add_argument("--password", type=str, default="changeme123", help="Password for all generated users")

    def handle(self, *args, **options):
        num_riders = options["riders"]
        num_drivers = options["drivers"]
        raw_password = options["password"]
        hashed_password = hash_password(raw_password)

        base_rider_phone = 5550000000
        base_driver_phone = 5559000000

        riders = [
            {
                "model": "users.user",
                "fields": {
                    "email": f"rider{i + 1}@example.com",
                    "first_name": f"Rider{i + 1}",
                    "last_name": "Test",
                    "phone_number": f"+1{base_rider_phone + i:010d}",
                    "role": "rider",
                    "is_active": True,
                    "is_staff": False,
                    "password": hashed_password,
                },
            }
            for i in range(num_riders)
        ]

        drivers = [
            {
                "model": "users.user",
                "fields": {
                    "email": f"driver{i + 1}@example.com",
                    "first_name": f"Driver{i + 1}",
                    "last_name": "Test",
                    "phone_number": f"+1{base_driver_phone + i:010d}",
                    "role": "driver",
                    "is_active": True,
                    "is_staff": False,
                    "password": hashed_password,
                },
            }
            for i in range(num_drivers)
        ]

        fixtures_dir = Path("users/fixtures")
        fixtures_dir.mkdir(parents=True, exist_ok=True)

        with open(fixtures_dir / "01_drivers.json", "w") as f:
            json.dump(drivers, f, indent=2)

        with open(fixtures_dir / "02_riders.json", "w") as f:
            json.dump(riders, f, indent=2)

        self.stdout.write(self.style.SUCCESS("✅ Fixtures generated: 01_drivers.json, 02_riders.json"))
