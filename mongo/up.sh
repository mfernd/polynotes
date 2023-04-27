#!/bin/bash

docker compose up -d

docker compose exec mongo-rs2-node1 /bin/sh -c "mongosh < /app/init.js"
docker compose exec mongo-rs1-node1 /bin/sh -c "mongosh < /app/init.js"
docker compose exec mongo-csrs-node1 /bin/sh -c "mongosh < /app/init.js"
docker compose exec mongos-router /bin/sh -c "mongosh < /app/init.js"
