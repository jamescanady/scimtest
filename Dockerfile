FROM node:22-alpine as release
WORKDIR /app
ARG PRODUCT_VERSION=0.0.0
ENV NPM_PACKAGE_VERSION=$PRODUCT_VERSION
ENV NODE_ENV=production
RUN echo "PRODUCT_VERSION=$PRODUCT_VERSION"

FROM node:lts-alpine as build
WORKDIR /app
COPY package.json .
ADD ./src/ ./src
RUN npm install
RUN npm run build

FROM release
COPY --from=build /app/dist/ /app/

# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#handling-kernel-signals
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "index.js"]
