var bcrypt = require("bcrypt");
var config = require("config");

function hash_pw(pw) {
    var salt = bcrypt.genSaltSync(config.get("salt"));
    var hash = bcrypt.hashSync(pw, salt);

    return hash;
}

function kiemTraDangNhap(req) {
    if (req.session.User) {
        return true;
    }
    return false;
}

function getSessionUser(req) {
    if (req.session.User) {
        return req.session.User;
    }
    return false;
}

function setSessionDangNhap(req) {
    req.session.User = {
        hoten: "Đặng Minh Hiếu",
        username: "hieugiddy",
        quyen: "1",
        avatar: "/static/img/avatar.png"
    }
}
module.exports = {
    hash_pw: hash_pw,
    kiemTraDangNhap: kiemTraDangNhap,
    setSessionDangNhap: setSessionDangNhap,
    getSessionUser: getSessionUser
}