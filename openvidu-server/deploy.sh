DOCKER_BUILDKIT=1 docker build --progress=plain -t openvidu-server .
docker rm openvidu-server -f
docker run -d -p 8443:8443 --name openvidu-server openvidu-server
#docker-compose -f ../gateway/docker-compose.yml up -d --force-recreate --no-deps api
docker image prune -f