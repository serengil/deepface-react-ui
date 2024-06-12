cd ..

# remove exisiting images
# docker rm -f $(docker ps -a -q --filter "ancestor=deepface-react-app")

# docker build -t deepface-react-app .

docker run -p 3000:3000 deepface-react-app