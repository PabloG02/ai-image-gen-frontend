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

# Build the app
RUN pnpm run build

# Stage 2: Serve the built application with Nginx
FROM nginx:alpine

# Copy the build output from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
