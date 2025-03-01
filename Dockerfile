FROM node:22-slim

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

ENV NODE_ENV=production
ENV FUNCTION_TARGET=helloWorld

EXPOSE 8080
CMD [ "yarn", "start" ] 