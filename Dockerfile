# Use the official Node.js image as a base image
FROM node:16

# Set the working directory
WORKDIR /home/akshith/Desktop/myproject

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the application with nodemon
CMD ["nodemon", "app.js"]
