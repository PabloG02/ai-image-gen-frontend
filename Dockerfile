# Stage 1: Build the React application
FROM node:24-alpine AS build

# Set working directory
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy pnpm-lock.yaml and package.json
COPY pnpm-lock.yaml package.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Set API_URL placeholder before build
RUN sed -i "s|export const API_URL = .*;|export const API_URL = 'API_URL_PLACEHOLDER';|" src/lib/config.ts

# Build the app
RUN pnpm run build

# Stage 2: Serve the built application with Nginx
FROM nginx:alpine

# Copy the build output from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the start script
COPY docker-start.sh /start.sh
RUN chmod +x /start.sh

# Copy custom nginx configuration if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Environment variable for the API URL
ENV API_URL=http://localhost:8000

# Use our script as CMD
CMD ["/bin/sh", "/start.sh"]
