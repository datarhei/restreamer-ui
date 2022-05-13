FROM node:17-alpine3.15

WORKDIR /ui

COPY . /ui

RUN yarn install && \
	npm run build

EXPOSE 3000
CMD [ "npm", "run", "start" ]
