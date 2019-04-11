FROM ubuntu:latest

WORKDIR /app
COPY ./controllers ./controllers
COPY ./domain/ ./domain
COPY ./services ./services
COPY ./utils ./utils
COPY ./index.js ./index.js
COPY ./package.json ./package.json
COPY ./process.json ./process.json
COPY ./.sequelizerc ./.sequelizerc
COPY ./wait-for-it.sh ./wait-for-it.sh
RUN apt-get update && apt-get install -y curl && apt-get install -y gnupg
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash
RUN apt-get install -y nodejs
RUN npm install
ENV NODE_ENV development
ENV DB_HOST postgres
ENV DB_USERNAME postgres
ENV DB_PASSWORD docker
ENV DB_NAME_DEV tosudb
ENV DB_NAME_TEST tosudb_test
ENV DB_NAME_PROD tosudb_prod
ENV SECRET_KEY superSecretKeyABC
EXPOSE 3001
CMD (./wait-for-it.sh postgres:5432 && npx sequelize db:create && npx sequelize db:migrate); npm start
