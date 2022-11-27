# split geojsons to gpx, generate sql
npm run split

# copy all test data into backend
export GPX_ZIP="demo_gpx.zip"
rm "$GPX_ZIP"

cd result
zip -r -D "../$GPX_ZIP" *
cd ..
# move to backend folder
cp "$GPX_ZIP" "../backend/demo/$GPX_ZIP"

# copy sql into demo-db
cp ./result/init.sql ../demo-db/init.sql

# run demo-db build


