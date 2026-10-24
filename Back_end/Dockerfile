FROM maven:3.9.6-eclipse-temurin-17

WORKDIR /app

# Copy all backend files into the container
COPY . .

# Build the application using standard maven command
RUN mvn clean package -DskipTests

EXPOSE 8080

# Run the jar file
CMD ["java", "-jar", "target/tasty-burger-api-1.0.0.jar"]