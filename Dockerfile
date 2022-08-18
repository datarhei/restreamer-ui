ARG NODE_IMAGE=node:18.6.0-alpine3.15
ARG CADDY_IMAGE=caddy:2.5.2-alpine

FROM $NODE_IMAGE as builder

ARG NODE_SPACE_SIZE=10240
ENV NODE_OPTIONS="--openssl-legacy-provider --max-old-space-size=$NODE_SPACE_SIZE"

ENV PUBLIC_URL "./"

COPY . /ui

WORKDIR /ui

RUN cd /ui && \
	npm config set fetch-retries 10 && \
	npm config set fetch-retry-mintimeout 100000 && \
	npm config set fetch-retry-maxtimeout 600000 && \
	npm config set cache-min 3600 && \
	npm config ls -l && \
	npm install && \
	npm run build

FROM $CADDY_IMAGE

COPY --from=builder /ui/build /ui/build
COPY --from=builder /ui/Caddyfile /ui/Caddyfile

WORKDIR /ui

EXPOSE 3000

CMD [ "caddy", "run", "-config", "/ui/Caddyfile" ]
