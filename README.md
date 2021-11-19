# Magma CI Dashboard

Dashboard consuming data from Magma's Firestore Realtime Database.

## Project setup
- Clone repo and install dependencies
```
git clone https://github.com/magma/ci-dashboard.git
cd ci-dashboard
npm install
npm run serve
```
- To view locally, open http://localhost:8080/ on your browser
- You will need to obtain Firebase API config and add it to Firebase_config.json file

### Deploy to firestore
```
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


