FROM node:23-bullseye-slim

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y default-mysql-client && rm -rf /var/lib/apt/lists/*

COPY api/ .

# On fait du design first, on a plus besoin de générer la doc
# RUN npm install && npm run swagger-autogen
RUN npm install


EXPOSE 3000