# SE06 API

## Shell (Dev)

```shell
./mvnw install

./mvnw spring-boot:run -Dspring.profiles.active=dev
```

## Shell (Prod)

```shell
./mvnw install

./mvnw spring-boot:run -Dspring.profiles.active=prod
```

## Docker compose (Dev)

```shell
docker-compose -f docker-compose.dev.yml up -d
```

## Docker compose (Prod)

```shell
docker-compose -f docker-compose.prod.yml up -d
```