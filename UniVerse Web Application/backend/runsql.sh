#!/bin/bash
CONTAINER_NAME="postgres_db"
NEW_DB="universe"
SQL_FILE="./src/db/migrate/schema.sql"
USERNAME="compyone"

docker exec -it $CONTAINER_NAME psql -U $USERNAME -d postgres -c "CREATE DATABASE $NEW_DB;"
docker cp $SQL_FILE $CONTAINER_NAME:/tmp/schema.sql
docker exec -it $CONTAINER_NAME psql -U $USERNAME -d $NEW_DB -f /tmp/schema.sql
docker exec -it $CONTAINER_NAME rm /tmp/schema.sql
echo "Database '$NEW_DB' created and schema executed successfully!"



