
module.exports = {
    "port": 8090,
    "jwt_secret": "654321",
    "jwt_expiration_in_seconds": 6000,
    "environment": "dev",
    "permissionLevels": {
        "NORMAL_USER": 3,
        "ADMIN_USER": 2,
        "SUPER_ADMIN": 1
    },
    "dbConfig":"mongodb+srv://budget:M8oabVZoRicXrVPD@cluster1.omck1.mongodb.net/budget?retryWrites=true&w=majority",
    "dbOptions":{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: 30, // Retry up to 30 times
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
    }
    

};
