var express = require("express");
var router = express.Router();
var helpers = require("../helpers/account");
var DB = require("../common/DB");
var conn = DB.getConnection();

router.route("/")
    .get(function(req, res) {
        if (helpers.kiemTraDangNhap(req))
            res.redirect("/");
        else
            res.render("account", {
                data: {
                    page: "login",
                    web_title: "Partner - Cứu Hộ Giao Thông, Cứu Hộ Xe Cơ Giới Tại Khu Vực Đà Nẵng",
                    page_name: "Đăng nhập tài khoản",
                    app_name: "XXX Partner"
                }
            });
    })
    .post(function(req, res) {
        helpers.setSessionDangNhap(req);
        res.redirect("/");
    });
router.route("/quenmk")
    .get(function(req, res) {
        if (helpers.kiemTraDangNhap(req))
            res.redirect("/");
        else
            res.render("account", {
                data: {
                    page: "quenmk",
                    web_title: "Partner - Cứu Hộ Giao Thông, Cứu Hộ Xe Cơ Giới Tại Khu Vực Đà Nẵng",
                    page_name: "Quên mật khẩu",
                    app_name: "XXX Partner"
                }
            });
    });

router.route("/recovery-password")
    .get(function(req, res) {
        if (helpers.kiemTraDangNhap(req))
            res.redirect("/");
        else
            res.render("account", {
                data: {
                    page: "recovery_mk",
                    web_title: "Partner - Cứu Hộ Giao Thông, Cứu Hộ Xe Cơ Giới Tại Khu Vực Đà Nẵng",
                    page_name: "Khôi phục mật khẩu",
                    app_name: "XXX Partner"
                }
            });
    });
router.route("/doi-mk")
    .get(function(req, res) {
        if (helpers.kiemTraDangNhap(req))
            res.render("account", {
                data: {
                    page: "doi_mk",
                    web_title: "Partner - Cứu Hộ Giao Thông, Cứu Hộ Xe Cơ Giới Tại Khu Vực Đà Nẵng",
                    page_name: "Đổi mật khẩu",
                    app_name: "XXX Partner"
                }
            });
        else
            res.redirect("/");
    });
router.route("/dang-xuat")
    .get(function(req, res) {
        helpers.dangXuat(req,res)
    });
module.exports = router;