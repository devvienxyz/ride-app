# Setup up Postgresql on Ubuntu

## Install

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib libpq-dev
```

Run this to verify if the service is running: ```sudo systemctl status postgresql```

## Create Postgresql User and Database

```bash
sudo -u postgres psql
```

Inside the prompt, run:

```bash
CREATE DATABASE dev_ride_app;
CREATE USER admin_ride_app WITH PASSWORD '**<YOUR PASSWORD HERE>**';
ALTER ROLE admin_ride_app SET client_encoding TO 'utf8';
ALTER ROLE admin_ride_app SET default_transaction_isolation TO 'read committed';
ALTER ROLE admin_ride_app SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE dev_ride_app TO admin_ride_app;
\q
```
