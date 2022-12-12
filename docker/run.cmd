docker-compose stop
RMDIR /S /Q .docker/
docker-compose rm -f
docker-compose pull
docker-compose up -d