# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock to the container
COPY package.json yarn.lock ./

RUN yarn install

# Copy the rest of the application code
COPY . .

# Compile TypeScript files
RUN yarn build

# Expose the port that your application will run on
EXPOSE 3000

# Command to run your application
CMD ["yarn", "start"]
