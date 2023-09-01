sh.addShard('rs1/mongo-rs1-node1:27017,mongo-rs1-node2:27017,mongo-rs1-node3:27017');
sh.addShard('rs2/mongo-rs2-node1:27017,mongo-rs2-node2:27017,mongo-rs2-node3:27017');

// change db context
use polynotes-db

// enable sharding on it
sh.enableSharding('polynotes-db');

// create unique indexes on “users” & “pages” collection
db.users.createIndex({ 'uuid': 1 }, { unique: true });
db.users.createIndex({ 'email': 1 }, { unique: true });
db.users.createIndex({ 'timeTracker.times.uuid': 1 }, { unique: true });
db.pages.createIndex({ 'uuid': 1 }, { unique: true });

// shard only “pages” collections on the `uuid` index
sh.shardCollection('polynotes-db.pages', { 'uuid': 1 }, true);
