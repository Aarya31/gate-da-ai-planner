# Multi-stage production build Dockerfile for GATE DA 2027 AI Study Planner

# Stage 1: Build Angular Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npx ng build --configuration production

# Stage 2: Build Spring Boot Backend with bundled frontend static assets
FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /app/backend
COPY backend/pom.xml ./
RUN mvn dependency:go-offline
COPY backend/src ./src
COPY --from=frontend-build /app/frontend/dist/frontend/browser ./src/main/resources/static
RUN mvn clean package -DskipTests

# Stage 3: Lightweight Production JRE Image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=backend-build /app/backend/target/planner-backend-1.0.0.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
