FROM node:lts-alpine

WORKDIR /var/opt/app

COPY . .

RUN npm install

EXPOSE 8080

CMD npm run serve
