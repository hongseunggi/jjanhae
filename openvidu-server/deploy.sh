DOCKER_BUILDKIT=1 docker build --progress=plain -t openvidu/openvidu-server .
docker rm openvidu/openvidu-server:latest -f
docker run -d -p 8443:8443 --name openvidu/openvidu-server openvidu/openvidu-server
#docker-compose -f ../gateway/docker-compose.yml up -d --force-recreate --no-deps api
docker image prune -f