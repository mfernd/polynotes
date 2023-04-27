#!/bin/bash

docker compose down

docker volume rm polynotes_mongos-router
docker volume rm polynotes_mongo-csrs-node1 polynotes_mongo-csrs-node2 polynotes_mongo-csrs-node3
docker volume rm polynotes_mongo-rs1-node1 polynotes_mongo-rs1-node2 polynotes_mongo-rs1-node3
docker volume rm polynotes_mongo-rs2-node1 polynotes_mongo-rs2-node2 polynotes_mongo-rs2-node3