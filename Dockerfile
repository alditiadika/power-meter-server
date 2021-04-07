FROM node:12.20-alpine
ARG SERVER_ENV=''

COPY . .
RUN rm -rf src/config/config.json && \
  cp -f src/config/config-$SERVER_ENV.json src/config/config.json && \
  cat src/config/config.json && \
  npm install && \
  npm run lint && \
  npm run build

CMD ["npm", "run", "start"]
EXPOSE 8080