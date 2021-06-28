var q = require("q");
var db = require("../common/DB");
var conn = db.getConnection();

function getChiTietTaiKhoan(id) {
    if (id) {
        var defer = q.defer();
        conn.query('SELECT * FROM taikhoan WHERE ID_TaiKhoan=?',id ,function (error, results, fields) {
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
    getChiTietTaiKhoan: getChiTietTaiKhoan
}