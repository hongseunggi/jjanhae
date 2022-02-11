echo #*#*#*#* delete existed openvidu-server
sudo rm -rf /home/ubuntu/CustomOpenvidu/openvidu/openvidu-server
echo #*#*#*#* change direcotry to openvidu
cd /home/ubuntu/CustomOpenvidu/openvidu
echo #*#*#*#* create new openvidu-server directory
mkdir openvidu-server
echo #*#*#*#* copy openvidu-server
sudo cp -r /home/jenkins/workspace/jjanhae-dev-openvidu-server-build/openvidu-server ./
echo #*#*#*#* copy key
sudo cp /home/ubuntu/i6a507.p.ssafy.io.p12 /home/ubuntu/CustomOpenvidu/openvidu/openvidu-server/src/main/resources

echo #*#*#*#* move to openvidu-server
cd /home/ubuntu/CustomOpenvidu/openvidu/openvidu-server/
echo #*#*#*#* build maven openvidu-server
mvn clean install -U
echo #*#*#*#* build maven openvidu
cd /home/ubuntu/CustomOpenvidu/openvidu
mvn package -DskipTests
echo #*#*#*#* move to docker
cd /home/ubuntu/CustomOpenvidu/openvidu/openvidu-server/docker/openvidu-server
echo #*#*#*#* run create_image.sh
sudo chmod +x create_image.sh
sudo su
./create_image.sh 2.20.1

#su ubuntu
#cd /home/ubuntu/opt/openvidu
#미치겠네 이거 매번 다시켜야하나....
#nohup ./openvidu restart & > /dev/null
docker image prune -f