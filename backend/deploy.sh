DOCKER_BUILDKIT=1 docker build --progress=plain -t jjanhae .
#docker rm jjanhae -f
#docker run -d -p 8081:8081 --name jjanhae jjanhae
docker-compose -f /jenkins/workspace/backend-buil/gateway/docker-compose.yml up -d --force-recreate --no-deps api
docker image prune -f