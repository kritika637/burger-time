FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Copy the Back_end contents into the container workdir
COPY Back_end/ .

RUN ./mvnw clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/tasty-burger-api-1.0.0.jar"]