var redis = require("redis"),
    db = redis.createClient(32768, "192.168.99.100");
    userFunctions = {
        // create a new user
        add: function(firstName, lastName, cb) {
            // get the current count of users plus one for use as an ID
            db.incr("userCount", function(err, id) {
                if (err)
                    throw err;
                db.hmset("users:" + id, {"firstName": firstName, "lastName": lastName}, function(err) {
                    if (!err && cb)
                        cb(id);
                });
            });
        },
        // edit an existing user
        change: function(id, firstName, lastName, cb) {
            db.hmset("users:" + id, {"firstName": firstName, "lastName": lastName}, function(err) {
                if (!err && cb)
                    cb(id);
            });
        },
        // retrieve a user object
        getUser: function(id, cb) {
            db.hgetall("users:" + id, function(err, user) {
                if (!err)
                    cb(user);
            });
        },
        // retrieve a user object and concatenate the name
        getUserName: function(id, cb) {
            db.hgetall("users:" + id, function(err, user) {
                if (!err)
                {
                    userName = "No Name";
                    if (user) userName = user.firstName + " " + user.lastName;
                    cb(userName);
                }
            });
        },
        // delete a user
        deleteUser: function(id, cb) {
            db.del("users:" + id, function(err) {
                if (!err && cb)
                    cb();
            });
        }
    };

    // expose our object as the userFunctions property of this module
    exports.userFunctions = userFunctions;
