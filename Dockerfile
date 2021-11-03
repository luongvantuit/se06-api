FROM openjdk:11

WORKDIR /app

COPY . /app

RUN ./mvnw install

# CMD ["bash","mvnw","spring-boot:run","-Dspring.profiles.active=dev"]

CMD ["bash","mvnw","spring-boot:run"]

