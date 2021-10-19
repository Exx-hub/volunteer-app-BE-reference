const mongoose = require('mongoose');
mongoose.connect(process.env.mongo_connection_string, { useNewUrlParser: true, useUnifiedTopology: true });
//mongoose.connect("mongodb://innomovon:2dCMae3M0h0J345s@movon-shard-00-00-ignno.mongodb.net:27017,movon-shard-00-01-ignno.mongodb.net:27017,movon-shard-00-02-ignno.mongodb.net:27017/volunteer_app?ssl=true&replicaSet=MovOn-shard-0&authSource=admin&retryWrites=true", { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

let conn  = db.once('open', function () {
    console.log("Connected to DB")
    return "success"
});

let conn  = db.once('close', function () {
    console.log("Disconnected to DB")
    return "success"
});

module.exports = conn;