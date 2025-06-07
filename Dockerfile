# Use official Node.js image
FROM node:16

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy all other files
COPY . .

# Expose the port Hugging Face expects
EXPOSE 7860

# Start the Node.js server
CMD ["npm", "start"]
