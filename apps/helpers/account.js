var config = require("config");

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

function dangXuat(req,res){
    req.session.destroy(function(err) {
        res.redirect("/")
    })
}
module.exports = {
    kiemTraDangNhap: kiemTraDangNhap,
    setSessionDangNhap: setSessionDangNhap,
    getSessionUser: getSessionUser,
    dangXuat: dangXuat
}