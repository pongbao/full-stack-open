# FROM node:16

# WORKDIR /usr/src/app

# COPY . .

# RUN npm ci

# RUN npm run build

# RUN npm install -g serve
# CMD ["serve", "build"]

# There can only be one CMD instruction in a Dockerfile. If you list more than one CMD then only the last CMD will take effect. The main purpose of a CMD is to provide defaults for an executing container.

# The first FROM is now a stage called build-stage

FROM node:16 AS build-stage
WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run build

# This is a new stage, everything before this is gone, except the files we want to COPY

FROM nginx:1.20-alpine
# COPY the directory build from build-stage to /usr/share/nginx/html
# The target location here was found from the Docker hub page

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html