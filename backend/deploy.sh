DOCKER_BUILDKIT=1 docker build -t jjanhae .
docker rm jjanhae -f
docker run -d -p 8081:8081 --name jjanhae jjanhae
docker image prune -f