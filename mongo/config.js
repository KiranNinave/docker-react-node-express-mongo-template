config = {
    _id: "message",
    members: [
        {
            _id: 0,
            host: "mongo:27017"
        },
        {
            _id: 1,
            host: "mongo_repl:27017"
        }
    ]
};

// on primary
rs.initiate(config);
rs.status();

// on secondary

rs.slaveOk();
