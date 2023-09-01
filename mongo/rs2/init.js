rs.initiate({
    _id : 'rs2',
    version: 1,
    members: [
        { _id: 0, host: 'mongo-rs2-node1:27017' },
        { _id: 1, host: 'mongo-rs2-node2:27017' },
        { _id: 2, host: 'mongo-rs2-node3:27017' },
    ],
});
