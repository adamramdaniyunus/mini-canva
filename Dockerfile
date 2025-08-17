# Setup Project
FROM node:20

# Define working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Expose application port
EXPOSE 3000
CMD ["npm", "start"]