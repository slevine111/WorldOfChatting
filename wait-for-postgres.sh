#!/bin/sh
#wait-for-postgres.sh

shift
cmd="$@"

until psql -h $DB_SERVICE_SERVICE_HOST -U $POSTGRES_USER -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"
exec $cmd

