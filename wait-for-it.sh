#!/bin/sh
# wait-for-postgres.sh


until PGPASSWORD="root" psql -h "postgres" -U "root" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done


{
    /usr/backend/node_modules/.bin/sequelize db:create && /usr/backend/node_modules/.bin/sequelize db:migrate && node ./src
} || {
    /usr/backend/node_modules/.bin/sequelize db:migrate && node ./src
}