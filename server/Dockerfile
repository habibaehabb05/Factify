# Base Image
FROM node:18-alpine

# Set Working Directory
WORKDIR /app

# Copy Package Files
COPY package*.json ./

# Install Dependencies
RUN npm install --production

# Copy Application Code
COPY . .

# Expose Port
EXPOSE 5000

# Start Command
CMD ["node", "app.js"]
