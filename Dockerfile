# syntax=docker/dockerfile:1

# Builds the frontend from source, so the image can be built anywhere with just `docker build .`
# (the API client in src/gen is committed, no backend is needed for the build)
FROM node:24 AS build
WORKDIR /src
# the e2e tests are not part of the image: don't download the Cypress binary
ENV CYPRESS_INSTALL_BINARY=0 NG_CLI_ANALYTICS=false
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund
COPY . .
RUN npx ng build

FROM nginx:1.30
COPY --from=build /src/dist/controlpage-frontend /usr/share/nginx/html
EXPOSE 80
