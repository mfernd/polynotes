rs.initiate({
    _id: 'csrs',
    configsvr: true,
    version: 1,
    members: [
        { _id: 0, host: 'mongo-csrs-node1:27017' },
        { _id: 1, host: 'mongo-csrs-node2:27017' },
        { _id: 2, host: 'mongo-csrs-node3:27017' },
    ],
});
