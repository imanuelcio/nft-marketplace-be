# Gunakan image Node.js
FROM node:18-alpine

# Set work directory
WORKDIR /

COPY package.json package-lock.json ./

COPY . .
# Install dependencies
RUN npm install


# Jalankan server
CMD ["npm","run","start"]
