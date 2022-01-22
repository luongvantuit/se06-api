# __Environments__

## __Setup environment local__

__Step 1:__ Install NodeJS by requirement NodeJS,NPM or Yarn check version node

```
node -v
```

if NodeJS not existed, then

- __Windows__

Open browser, [NodeJS](https://nodejs.org/en/download/)

or use chocolatey

```
choco install nodejs
```

- __Linux & GNU__

```
sudo apt install node
```

- __MacOS__

The first install NodeJS from [NodeJS](https://nodejs.org/en/download/) or install [Brew](https://brew.sh/)

```
brew install node
```

__NPM__

```
npm -v
```

__Yarn__

```
yarn -v
```

If yarn not found, then install yarn with command

```
npm install -g yarn
```

__Step 2:__ Install library 

Install with NPM 

```
npm install
``` 

Install with Yarn (Recommened)

```
yarn install
```

__Step 3:__ Run project

Requirement MongoDB run on port 27017

Project run on port 8080 (default) [localhost](http://localhost:8080)

- __NPM__

```
npm start
```

- __Yarn__

```
yarn start
```

## __Deployment with Docker__

__Step 1__ Setup Docker

Download and install Docker from [How to setup Docker](https://docs.docker.com/get-docker/)

__Step 2__ 

Setup Docker Compose [How to setup Docker Compose](https://docs.docker.com/compose/install/)

__Step 3__

Run command start 

```
docker-compose up -d --build
```