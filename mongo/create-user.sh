#!/bin/bash

docker compose exec mongos-router /bin/sh -c "mongosh < /app/create-mongo-user.js"
