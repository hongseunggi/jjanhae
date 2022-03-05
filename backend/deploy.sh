sudo cp /home/ubuntu/jjanhae.p12 /jenkins/workspace/backend-buil/backend
DOCKER_BUILDKIT=1 docker build --no-cache --progress=plain -t jjanhae .
docker rm jjanhae -f
docker run -d -p 8081:8081 --name jjanhae jjanhae
# docker-compose -f /jenkins/workspace/backend-buil/gateway/docker-compose.yml up -d --force-recreate --no-deps api
docker image prune -f