# __Setup environment__

## __Local__

- __Step 1:__

    1. Local [Setup MongoDB Local](https://docs.mongodb.com/manual/installation/)

    2. Docker 

        2.1 [Setup Docker](https://docs.docker.com/get-docker/)

        2.2 [Setup MogodbDB with Docker](https://hub.docker.com/_/mongo)

- __Step 2:__

    Require __NodeJS__

    ```shell
    yarn install && yarn start
    ```

## __Docker__

- __Step 1:__

    [Setup Docker](https://docs.docker.com/get-docker/)

- __Step 2:__

    [Setup Docker compose](https://docs.docker.com/compose/install/)

    Non requirement on __MacOS__

- __Step 3:__

    ```shell
    docker-compose up -d --build
    ```
