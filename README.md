# Magma CI Dashboard

Dashboard consuming data from Magma's Firestore Realtime Database.

## Project setup

- Clone the dashboard repo.

```
git clone git@github.com:magma/ci-dashboard.git
cd ci-dashboard
```

- Obtain Firebase_config.json by opening the currently deployed dashboard and searching the sources for apiKey. Create a new file `Firebase_config.json` in the ci-dashboard's root directory and add the whole JSON object.
- Install all dependencies and run the dashboard locally.

```
npm install
npm run serve
```

- Open http://localhost:8080/ on your browser to view the local build.
- Obtain the Firebase API config and from the locally build sources and add it to the `Firebase_config.json` file.

### Build and Deploy the Dashboard

- Install the [Firebase CLI tool](https://firebase.google.com/docs/cli), for example via `npm`.

```
npm install -g firebase-tools
```

- Build and deploy the dashboard. The required credentials are managed by the Linux Foundation.

```
npm run build
firebase login # opens web browser to login with valid Google account
firebase deploy
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


