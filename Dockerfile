FROM node:latest

WORKDIR /app/api

COPY . .

RUN yarn install

RUN cat .env.docker >> .env

CMD [ "yarn","start" ]