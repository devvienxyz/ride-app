# Tools

## [DBeaver](https://dbeaver.io/download/)

1. Install DBeaver.

   ```bash
   sudo  wget -O /usr/share/keyrings/dbeaver.gpg.key https://dbeaver.io/debs/dbeaver.gpg.key
   echo "deb [signed-by=/usr/share/keyrings/dbeaver.gpg.key] https://dbeaver.io/debs/dbeaver-ce /" | sudo tee /etc/apt/sources.list.d/dbeaver.list
   sudo apt-get update && sudo apt-get install dbeaver-ce
   ```

2. Open the DBeaver software and install missing drivers if prompted.

   ![DBeaver SQLite Missing Drivers](assets/dbeaver_1_sqlite_drivers.png)
   ![DBeaver Postgresql Missing Drivers](asseets/dbeaver_2_postgres_drivers.png)

3. Add a new connection and configure the new instance.

   ![DBeaver configure new connection](assets/dbeaver_3_configure_conn_settings.png)

4. Test the connection. You should see a success prompt like this:

   ![DBeaver test connection success prompt](assets/dbeaver_4_test_connection.png)

5. You should see the list of databases under the new connection.

   ![DBeaver Localhost databases](assets/dbeaver_5_list_of_dbs.png)
