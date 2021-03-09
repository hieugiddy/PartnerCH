var q = require("q");
var db = require("../common/DB");
var conn = db.getConnection();

function addUser(user) {
    if (user) {
        var defer = q.defer();
        conn.query('INSERT INTO users SET ?', user, function (error, results, fields) {
            if (error)
                defer.reject(error);
            else
                defer.resolve(results);
        });

        return defer.promise;
    }

    return false;
}
function xuLiLogin(email,password) {
    if (email && password) {
        var defer = q.defer();
        conn.query("SELECT * FROM users WHERE username=? and password=?",[email,password], function (error, results) {
            if (error)
                defer.reject(error);
            else
                defer.resolve(results);
        });

        return defer.promise;
    }

    return false;
}

module.exports = {
    addUser: addUser,
    xuLiLogin: xuLiLogin
}