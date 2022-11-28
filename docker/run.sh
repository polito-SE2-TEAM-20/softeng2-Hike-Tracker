docker-compose stop
rm -rf .docker/
docker-compose rm -f
docker-compose pull
docker-compose up -d