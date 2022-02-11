sudo rm -rf /home/ubuntu/CustomOpenvidu/openvidu/openvidu-server
cd /home/ubuntu/CustomOpenvidu
mkdir openvidu-server
cd /home/ubuntu/CustomOpenvidu/openvidu/openvidu-server
sudo cp -r /home/jenkins/workspace/jjanhae-dev-openvidu-server-build/openvidu-server ./
sudo cp /home/ubuntu/i6a507.p.ssafy.io.p12 /home/ubuntu/CustomOpenvidu/openvidu/openvidu-server/src/main/resources

mvn clean install -U
cd /home/ubuntu/CustomOpenvidu/openvidu
mvn package -DskipTests
cd /home/ubuntu/CustomOpenvidu/openvidu/openvidu-server/docker/openvidu-server
sudo chmod +x .create_image.sh
./create_image.sh 2.20.1

cd /home/ubuntu/opt/openvidu
./openvidu restart &
docker image prune -f