FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 80
EXPOSE 8080
EXPOSE 3000

CMD [ "node", "index.js" ]