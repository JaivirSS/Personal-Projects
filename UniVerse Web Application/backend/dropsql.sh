#!/bin/bash
CONTAINER_NAME="postgres_db"
NEW_DB="universe"
SQL_FILE="./src/db/migrate/schema.sql"
USERNAME="compyone"

docker exec -it $CONTAINER_NAME psql -U $USERNAME -d postgres -c "DROP DATABASE $NEW_DB;"

