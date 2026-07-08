#!/bin/sh

docker compose build
docker compose run web-dev cp /app/package-lock.json /host

