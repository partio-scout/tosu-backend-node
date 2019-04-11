FROM ubuntu:latest

WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y --no-install-recommends apt-utils
RUN  apt-get install -y curl && apt-get install -y gnupg
RUN curl -sL https://deb.nodesource/setup_10.x | bash
RUN apt-get install -y nodejs
RUN npm install
EXPOSE 3001
CMD npm start

