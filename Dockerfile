#   Use an official Node.js runtime as the base image

FROM node:18-alpine
 
# # Set the working directory in the container

WORKDIR /app
 
# # Copy only the package.json and package-lock.json first to leverage Docker cache

COPY package.json package-lock.json ./
 
# # Install dependencies using npm

RUN npm install
 
# # Copy the rest of the application files to the working directory

COPY . .
 
# # Expose the port your application runs on

EXPOSE 3000
 
# # Command to start the application

CMD [ "npm", "run", "dev" ]
 