FROM node:latest

WORKDIR /app/api

COPY . .

RUN npm i -g typescript

RUN yarn install

RUN cat .env.docker >> .env

RUN rm -rf ./build

RUN tsc

RUN cp -R ./resources ./build/resources 

RUN cat ./serviceAccountKey.json >> ./build/serviceAccountKey.json

CMD [ "node","./build/index.js" ]