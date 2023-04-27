sh.addShard('rs1/mongo-rs1-node1:27017,mongo-rs1-node2:27017,mongo-rs1-node3:27017');
sh.addShard('rs2/mongo-rs2-node1:27017,mongo-rs2-node2:27017,mongo-rs2-node3:27017');

const user = process.env.MONGO_USER ?? 'root';
const pwd = process.env.MONGO_PASSWORD ?? 'root';

use admin

db.createUser({
    user,
    pwd,
    roles: ['root'],
});
