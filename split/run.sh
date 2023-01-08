export UPLOADS_ZIP="demo_uploads.zip"
export DB_USERNAME="germangorodnev"
export DB_NAME=hiking_demo

rm -rf ./result/*

# split geojsons to gpx, generate sql
npm run split

# copy all test data into backend
rm "$UPLOADS_ZIP"

cd result
zip -r -q -D "../$UPLOADS_ZIP" *
cd ..
# move to backend folder
cp "$UPLOADS_ZIP" "../backend/demo/$UPLOADS_ZIP"
cp ./result/demo.json "../backend/demo/demo.json"

rm $UPLOADS_ZIP

# create db, populate with data
psql -U ${DB_USERNAME} -c "DROP DATABASE IF EXISTS $DB_NAME;"
psql -U ${DB_USERNAME} -c "CREATE DATABASE $DB_NAME;"
psql -U ${DB_USERNAME} -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USERNAME;"
# psql -U ${DB_USERNAME} -c "alter database $DB_NAME set search_path = public, postgis;"

psql -U ${DB_USERNAME} -d ${DB_NAME} -f ./result/init.sql

# create dump
pg_dump --no-owner --no-acl --exclude-table-data=auditlog_logentry --username ${DB_USERNAME} ${DB_NAME} | gzip -9 > db.sql.gz

# copy dump into demo-db
cp db.sql.gz ../demo-db/db.sql.gz
rm db.sql.gz


