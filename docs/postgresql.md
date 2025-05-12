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

## Allow Connections from Docker Containers

1. Edit postgresql.conf

   ```bash
   sudo nano /etc/postgresql/<version>/main/postgresql.conf

   # My postgresql version is 14
   # sudo nano /etc/postgresql/14/main/postgresql.conf

   Uncomment and set:
   ```conf
   listen_addresses = '*'
   ```

2. Edit pg_hba.conf

   ```bash
   sudo nano /etc/postgresql/<version>/main/pg_hba.conf

   # My postgresql version is 14
   sudo nano /etc/postgresql/14/main/pg_hba.conf
   ```

   Add this line at the bottom of other host entries:

   ```conf
   host    all             all             172.22.0.0/16            md5
   host    all             all             172.17.0.0/16            md5
   ```

3. Restart PostgreSQL

   ```bash
   sudo systemctl restart postgresql
   ```

4. Check Firewall Settings

   Even though PostgreSQL is listening on all addresses, a firewall might be blocking incoming connections on port 5432.

   You can check and ensure that the firewall is configured to allow connections on that port by running:

   ```bash
   sudo ufw allow 5432/tcp
   ```

## Other useful commands

```bash
# login; it should prompt for your password
psql -h localhost -U admin_ride_app -d dev_ride_app

# inspect postgresql logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log


# Test Connection Using psql from Docker
./docker.sh bash dev
psql -h host.docker.internal -U admin_ride_app -d dev_ride_app
# example database url
# postgresql://<db user>:<db password>@host.docker.internal:5432/<db name>
```
