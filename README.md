# Magma CI Dashboard

Dashboard consuming data from Magma's Firestore Realtime Database.

## Project setup
- Clone repo and install dependencies
```
git clone https://github.com/magma/ci-dashboard.git
cd ci-dashboard

# Obtain Firebase_config.json by opening the currently deployed dashboard
# and searching the sources for apiKey. Copy the whole JSON object to Firebase_config.json

npm install
npm run serve
```
- To view locally, open http://localhost:8080/ on your browser
- You will need to obtain Firebase API config and add it to Firebase_config.json file

### Build and Deploy to firestore
```
npm run build
firestore login
firestore deploy
```
---
### Build docker images

build docker image for ci-dashboard
```bash
docker build -t ci-dashboard .
```

Start ci-dashboard server
```bash
docker run --rm -it -p 8080:8080 ci-dashboard
```
> The above command is for development use for now.


