echo jjanhae - delete existed openvidu-server
sudo rm -rf /home/ubuntu/CustomOpenvidu/openvidu/openvidu-server
echo jjanhae - change direcotry to openvidu
cd /home/ubuntu/CustomOpenvidu/openvidu
echo jjanhae - create new openvidu-server directory
mkdir openvidu-server
echo jjanhae - copy openvidu-server
sudo cp -r /home/jenkins/workspace/jjanhae-dev-openvidu-server-build/openvidu-server ./
echo jjanhae - copy key
sudo cp /home/ubuntu/jjanhae.p12 /home/ubuntu/CustomOpenvidu/openvidu/openvidu-server/src/main/resources

echo jjanhae - move to openvidu-server
cd /home/ubuntu/CustomOpenvidu/openvidu/openvidu-server/
echo jjanhae - build maven openvidu-server
mvn clean install -U
echo jjanhae - build maven openvidu
cd /home/ubuntu/CustomOpenvidu/openvidu
mvn package -DskipTests
