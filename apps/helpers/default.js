var config = require("config");
const multer = require('multer');

const Storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, appRoot + '/public/img');
    },
    filename(req, file, callback) {
        callback(null, file.fieldname + '_' + Date.now() + '_' + file.originalname);
    },
});

function uploadAnh(){
    return multer({ storage: Storage });
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
        id: 1,
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
    dangXuat: dangXuat,
    uploadAnh: uploadAnh
}