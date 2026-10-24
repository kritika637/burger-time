FROM maven:3.9.6-eclipse-temurin-17

WORKDIR /app

# Copy all backend files into container
COPY . .

# Build the app
RUN mvn clean package -DskipTests

EXPOSE 10000

# Limit JVM memory to 350MB (to prevent 512MB OOM crash) and use Render's PORT
CMD ["sh", "-c", "java -Xmx350m -Dserver.port=${PORT:-10000} -jar target/tasty-burger-api-1.0.0.jar"]