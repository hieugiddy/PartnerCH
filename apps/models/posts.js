var q = require("q");
var db = require("../common/DB");
var conn = db.getConnection();

function getAllPosts() {
    var defer = q.defer();
    conn.query('SELECT * FROM posts', function (error, results, fields) {
        if (error)
            defer.reject(error);
        else
            defer.resolve(results);
    });

    return defer.promise;
}

module.exports = {
    getAllPosts: getAllPosts
}