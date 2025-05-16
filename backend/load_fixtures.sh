#!/bin/bash

# users
# python manage.py loaddata users/fixtures/00_users.json
python manage.py loaddata users/fixtures/01_drivers.json
python manage.py loaddata users/fixtures/02_riders.json

# ride
python manage.py loaddata ride/fixtures/00_rides.json
python manage.py loaddata ride/fixtures/01_ride_events.json