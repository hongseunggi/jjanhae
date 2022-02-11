rm -rf /home/ubuntu/CustomOpenvidu/openvidu-server
cp -r * /home/ubuntu/CustomOpenvidu/openvidu-server
cp /home/ubuntu/i6a507.p.ssafy.io.p12 /home/ubuntu/CustomOpenvidu/openvidu-server/src/main/resources
cd /home/ubuntu/CustomOpenvidu/openvidu-server
mvn clean install -U

docker stop openvidu-server-custom
DOCKER_BUILDKIT=1 docker build --progress=plain -t openvidu/openvidu-server .
docker rm openvidu-server-custom -f
docker run -d -p 4443:4443 --name openvidu-server-custom openvidu/openvidu-server
docker cp target/openvidu-*.jar openvidu-server-custom:/
#docker-compose -f ../gateway/docker-compose.yml up -d --force-recreate --no-deps api
docker image prune -f
