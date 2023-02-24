FROM node:latest

WORKDIR /usr/src/app

ENV DB_USERNAME="postgres"
ENV DB_HOST="34.29.110.166"
ENV DB_DATABASE="postgres"
ENV DB_PASSWORD="chaos23"
ENV DB_PORT="5432"

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 80
EXPOSE 8080
EXPOSE 3000

CMD [ "node", "index.js" ]