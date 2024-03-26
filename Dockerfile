# Step 1: Choose a base image
FROM node:14.21.3

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and yarn.lock (or package-lock.json for npm) to leverage Docker cache
COPY package.json yarn.lock ./

# Step 4: Install dependencies
RUN yarn install

# Step 5: Copy the rest of your application code
COPY . .

# Step 6: Expose the port your app runs on
EXPOSE 3000

# Step 7: Start the application using yarn
CMD ["yarn", "start"]
