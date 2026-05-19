FROM node:20-alpine

# Install postgresql-client for pg_isready/psql, and dos2unix for CRLF handling
RUN apk add --no-cache postgresql-client dos2unix

WORKDIR /app

# Copy dependency configs
COPY package*.json ./

# Install all dependencies (needed for migrations and build)
RUN npm ci

# Copy the rest of the code
COPY . .

# Build the application
RUN npm run build

# Handle line endings for the entrypoint script (multi-OS safety)
RUN dos2unix entrypoint.sh && chmod +x entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
