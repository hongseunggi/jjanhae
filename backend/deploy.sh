docker build -t jjanhae .
docker rm jjanhae -f
docker run -d --rm --name jjanhae jjanhae
docker image prune -f