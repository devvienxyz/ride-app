# Django notes

## Fixtures

### [Optional] Making Fixtures

```bash
python manage.py generate_users_fixtures --riders 5 --drivers 5 --password <securepasswordhere>

# sample to demo pagination
python manage.py generate_ride_fixtures --count 21
```

### Load Fixtures

```bash
./backend/load_fixtures.sh
```
