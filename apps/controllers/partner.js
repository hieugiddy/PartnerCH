var express = require("express");
var router = express.Router();
var dateFormat = require('dateformat');
var ac_helpers = require("../helpers/default");
var TaiKhoanModel = require("../models/account");
var DoiTacModel = require("../models/doitac");
var HeThongModel = require("../models/hethong");
var htmlencode = require('htmlencode');
var decode = require('decode-html');

var date = new Date(),
    base_url = "CuuHoXe.TK";
var menu = [{
    name: "Home",
    path: "/"
},
{
    name: "Chi nhánh",
    path: "/chi-nhanh"
},
{
    name: "Dịch vụ",
    path: "/dich-vu"
},
{
    name: "Ưu đãi",
    path: "/uu-dai"
},
{
    name: "Tài khoản",
    path: "/"
}
];


router.route("/")
    .get(async function (req, res) {
        if (ac_helpers.kiemTraDangNhap(req)) {
            var info = await HeThongModel.getThongTinHeThong().then(data => data);
            var loaihinh = await DoiTacModel.getDSLoaiHinh().then(data => data);

            var taikhoan = await TaiKhoanModel.getChiTietTaiKhoan(ac_helpers.getSessionUser(req).id).then(data => data);
            taikhoan[0].NgaySinh = dateFormat(new Date(taikhoan[0].NgaySinh), "dd/mm/yyyy");

            let ttDoiTac = await DoiTacModel.getChiTietDoiTac(ac_helpers.getSessionUser(req).id).then((data) => data);
            ttDoiTac[0].NgayHoatDong = dateFormat(new Date(ttDoiTac[0].NgayHoatDong), "dd/mm/yyyy");
            ttDoiTac[0].NgayThamGia = dateFormat(new Date(ttDoiTac[0].NgayThamGia), "dd/mm/yyyy");

            let dsLinhVucKinhDoanh = await DoiTacModel.getLinhVucKinhDoanh(ttDoiTac[0].ID_DoiTac);
            var linhvuccc = await DoiTacModel.getLVKDChuaChon(ttDoiTac[0].ID_DoiTac).then(data => data);

            let hinhAnhs = await DoiTacModel.getHinhAnh(ttDoiTac[0].ID_DoiTac, 2);
            let giayPhepKD = await DoiTacModel.getHinhAnh(ttDoiTac[0].ID_DoiTac, 1);

            res.render("partner", {
                data: {
                    page: "thongtintaikhoan",
                    page_name: "Thông tin tài khoản",
                    info: info,
                    year: date.getFullYear(),
                    base_url: base_url,
                    menu: menu,
                    breadcrumb: [{
                        name: "Home",
                        path: "/"
                    },
                    {
                        name: "Thông tin tài khoản",
                        path: "/"
                    }
                    ],
                    taikhoan: taikhoan,
                    ttDoiTac: ttDoiTac,
                    lvkd: dsLinhVucKinhDoanh,
                    hinhAnhs: hinhAnhs,
                    giayPhepKD: giayPhepKD,
                    loaihinh: loaihinh,
                    linhvuccc: linhvuccc
                }
            });
        }
        else
            res.redirect("/account");
    })
    .post(ac_helpers.uploadAnh().array('HinhDaiDien', 1), async function (req, res) {
        var { btnLuuCB } = req.body;
        try {
            if (btnLuuCB != undefined) {
                let file = req.files;
                var ng = req.body.NgaySinh.split("/");
                var taikhoan = {
                    HoVaTen: req.body.HoVaTen,
                    GioiTinh: req.body.GioiTinh,
                    SoDienThoai: req.body.SoDienThoai,
                    NgaySinh: ng[2] + "-" + ng[1] + "-" + ng[0],
                    Email: req.body.Email,
                    DiaChi: req.body.DiaChi
                }
                if (file[0]) {
                    taikhoan.HinhDaiDien = '/static/img/' + file[0].filename;
                }
                var kq = await DoiTacModel.capNhatTaiKhoan(taikhoan, ac_helpers.getSessionUser(req).id);
            }
            else {
                var ng = req.body.NgayHoatDong.split("/");
                var doitac = {
                    MaSoDoanhNghiep: req.body.MaSoDoanhNghiep,
                    TenDoanhNghiep: req.body.TenDoanhNghiep,
                    IDLoaiHinh: req.body.IDLoaiHinh,
                    NgayHoatDong: ng[2] + "-" + ng[1] + "-" + ng[0],
                    Website: req.body.Website,
                    GioiThieuNgan: req.body.GioiThieuNgan
                }
                var xoaLinhVuc = await DoiTacModel.xoaLinhVucKD(req.body.ID_DoiTac);

                let themLVDT = await Promise.all(req.body.LinhVucKinhDoanh.map(async (i) => {
                    var themLV = await DoiTacModel.themLinhVucKD(i, req.body.ID_DoiTac);
                }));
                let chinhSuaDT = await DoiTacModel.capNhapDoiTac(doitac, req.body.ID_DoiTac);
            }
        }
        catch (e) {
            console.log(e);
        }
        res.redirect("/account");
    });
router.route("/upload-giay-to")
    .post(ac_helpers.uploadAnh().fields([{ name: 'fileCMNDT', maxCount: 1 }, { name: 'fileCMNDS', maxCount: 1 }, { name: 'fileGT', maxCount: 1 }]), async function (req, res) {
        let file = req.files;

        var t = (file.fileCMNDT) ? '/static/img/' + file.fileCMNDT[0].filename : req.body.tCMND;
        var s = (file.fileCMNDS) ? '/static/img/' + file.fileCMNDS[0].filename : req.body.sCMND;
        var gt = (file.fileGT) ? '/static/img/' + file.fileGT[0].filename : req.body.anhGT;

        let capNhapAnhTK = await DoiTacModel.capNhapAnhTK(t, s, ac_helpers.getSessionUser(req).id);
        let xoaAnhGT = await DoiTacModel.xoaAnhDoiTac(req.body.AnhGiayTo);
        let themAnhGT = await DoiTacModel.themAnhDoiTac(gt, 1, req.body.ID_DoiTac);

        res.redirect("/account");
    });
router.route("/upload-anh-doi-tac")
    .post(ac_helpers.uploadAnh().array('file', 999999), async function (req, res) {
        let file = req.files;
        let themAnhDT = await Promise.all(file.map(async (i) => {
            var link = '/static/img/' + i.filename;
            let addAnh = await DoiTacModel.themAnhDoiTac(link, 2, req.body.idDT);
        }));

        let hinhAnhs = await DoiTacModel.getHinhAnh(req.body.idDT, 2);
        res.json(hinhAnhs);
    });
router.route("/xoa-hinh-anh-doi-tac")
    .post(function (req, res) {
        try {
            var result = DoiTacModel.xoaAnhDoiTac(req.body.idAnh);
            if (!result)
                res.json({ "Messenger": "Đã có lỗi xảy ra" });
            else
                result.then(async function (dt) {
                    let hinhAnhs = await DoiTacModel.getHinhAnh(req.body.idDT, 2);
                    res.json(hinhAnhs);
                }).catch(function (err) {
                    res.json({ "Messenger": err });
                })
        }
        catch (e) {
            res.json({ "Messenger": e });
        }
    });
router.route("/chi-nhanh")
    .get(async function (req, res) {
        if (ac_helpers.kiemTraDangNhap(req)) {
            var info = await HeThongModel.getThongTinHeThong().then(data => data);

            var taikhoan = await TaiKhoanModel.getChiTietTaiKhoan(ac_helpers.getSessionUser(req).id).then(data => data);
            taikhoan[0].NgaySinh = dateFormat(new Date(taikhoan[0].NgaySinh), "dd/mm/yyyy");

            let ttDoiTac = await DoiTacModel.getChiTietDoiTac(ac_helpers.getSessionUser(req).id).then((data) => data);
            ttDoiTac[0].NgayHoatDong = dateFormat(new Date(ttDoiTac[0].NgayHoatDong), "dd/mm/yyyy");
            ttDoiTac[0].NgayThamGia = dateFormat(new Date(ttDoiTac[0].NgayThamGia), "dd/mm/yyyy");

            let dsLinhVucKinhDoanh = await DoiTacModel.getLinhVucKinhDoanh(ttDoiTac[0].ID_DoiTac);
            res.render("partner", {
                data: {
                    page: "chinhanh",
                    page_name: "Chi nhánh",
                    year: date.getFullYear(),
                    base_url: base_url,
                    menu: menu,
                    breadcrumb: [{
                        name: "Home",
                        path: "/"
                    },
                    {
                        name: "Chi nhánh",
                        path: "/chi-nhanh"
                    }
                    ],
                    taikhoan: taikhoan,
                    ttDoiTac: ttDoiTac,
                    lvkd: dsLinhVucKinhDoanh,
                    info: info
                }
            });
        }
        else
            res.redirect("/account");
    });
router.route("/chi-nhanh/them")
    .get(async function (req, res) {
        if (ac_helpers.kiemTraDangNhap(req)) {
            var info = await HeThongModel.getThongTinHeThong().then(data => data);

            var taikhoan = await TaiKhoanModel.getChiTietTaiKhoan(ac_helpers.getSessionUser(req).id).then(data => data);
            taikhoan[0].NgaySinh = dateFormat(new Date(taikhoan[0].NgaySinh), "dd/mm/yyyy");

            let ttDoiTac = await DoiTacModel.getChiTietDoiTac(ac_helpers.getSessionUser(req).id).then((data) => data);
            ttDoiTac[0].NgayHoatDong = dateFormat(new Date(ttDoiTac[0].NgayHoatDong), "dd/mm/yyyy");
            ttDoiTac[0].NgayThamGia = dateFormat(new Date(ttDoiTac[0].NgayThamGia), "dd/mm/yyyy");

            let dsLinhVucKinhDoanh = await DoiTacModel.getLinhVucKinhDoanh(ttDoiTac[0].ID_DoiTac);
            res.render("partner", {
                data: {
                    page: "themchinhanh",
                    page_name: "Thêm chi nhánh mới",
                    year: date.getFullYear(),
                    base_url: base_url,
                    menu: menu,
                    breadcrumb: [{
                        name: "Home",
                        path: "/"
                    },
                    {
                        name: "Chi nhánh",
                        path: "/chi-nhanh"
                    },
                    {
                        name: "Thêm chi nhánh",
                        path: "/"
                    }
                    ],
                    taikhoan: taikhoan,
                    ttDoiTac: ttDoiTac,
                    lvkd: dsLinhVucKinhDoanh,
                    info: info
                }
            });
        }
        else
            res.redirect("/account");
    });
router.route("/chi-nhanh/:id/sua")
    .get(async function (req, res) {
        if (ac_helpers.kiemTraDangNhap(req)) {
            var info = await HeThongModel.getThongTinHeThong().then(data => data);

            var taikhoan = await TaiKhoanModel.getChiTietTaiKhoan(ac_helpers.getSessionUser(req).id).then(data => data);
            taikhoan[0].NgaySinh = dateFormat(new Date(taikhoan[0].NgaySinh), "dd/mm/yyyy");

            let ttDoiTac = await DoiTacModel.getChiTietDoiTac(ac_helpers.getSessionUser(req).id).then((data) => data);
            ttDoiTac[0].NgayHoatDong = dateFormat(new Date(ttDoiTac[0].NgayHoatDong), "dd/mm/yyyy");
            ttDoiTac[0].NgayThamGia = dateFormat(new Date(ttDoiTac[0].NgayThamGia), "dd/mm/yyyy");

            let dsLinhVucKinhDoanh = await DoiTacModel.getLinhVucKinhDoanh(ttDoiTac[0].ID_DoiTac);
            res.render("partner", {
                data: {
                    page: "suachinhanh",
                    page_name: "Sửa chi nhánh",
                    year: date.getFullYear(),
                    base_url: base_url,
                    menu: menu,
                    breadcrumb: [{
                        name: "Home",
                        path: "/"
                    },
                    {
                        name: "Chi nhánh",
                        path: "/chi-nhanh"
                    },
                    {
                        name: "Sửa chi nhánh",
                        path: "/"
                    }
                    ],
                    id: req.params.id,
                    taikhoan: taikhoan,
                    ttDoiTac: ttDoiTac,
                    lvkd: dsLinhVucKinhDoanh,
                    info: info
                }
            });
        }
        else
            res.redirect("/account");
    });
router.route("/chi-nhanh/:id/xoa")
    .get(async function (req, res) {
        if (ac_helpers.kiemTraDangNhap(req))
            res.json({
                data: "Xóa " + req.params.id + " thành công"
            });
        else
            res.redirect("/account");
    });

router.route("/dich-vu")
    .get(async function (req, res) {
        if (ac_helpers.kiemTraDangNhap(req)) {
            var info = await HeThongModel.getThongTinHeThong().then(data => data);

            var taikhoan = await TaiKhoanModel.getChiTietTaiKhoan(ac_helpers.getSessionUser(req).id).then(data => data);
            taikhoan[0].NgaySinh = dateFormat(new Date(taikhoan[0].NgaySinh), "dd/mm/yyyy");

            let ttDoiTac = await DoiTacModel.getChiTietDoiTac(ac_helpers.getSessionUser(req).id).then((data) => data);
            ttDoiTac[0].NgayHoatDong = dateFormat(new Date(ttDoiTac[0].NgayHoatDong), "dd/mm/yyyy");
            ttDoiTac[0].NgayThamGia = dateFormat(new Date(ttDoiTac[0].NgayThamGia), "dd/mm/yyyy");

            let dsLinhVucKinhDoanh = await DoiTacModel.getLinhVucKinhDoanh(ttDoiTac[0].ID_DoiTac);
            let dichvu = await DoiTacModel.getDichVu(ttDoiTac[0].ID_DoiTac);
            res.render("partner", {
                data: {
                    page: "dichvu",
                    page_name: "Dịch vụ",
                    year: date.getFullYear(),
                    base_url: base_url,
                    menu: menu,
                    breadcrumb: [{
                        name: "Home",
                        path: "/"
                    },
                    {
                        name: "Dịch vụ",
                        path: "/dich-vu"
                    }
                    ],
                    taikhoan: taikhoan,
                    ttDoiTac: ttDoiTac,
                    lvkd: dsLinhVucKinhDoanh,
                    info: info,
                    dichvu: dichvu
                }
            });
        }
        else
            res.redirect("/account");
    });
router.route("/dich-vu/them")
    .get(async function (req, res) {
        if (ac_helpers.kiemTraDangNhap(req)) {
            var info = await HeThongModel.getThongTinHeThong().then(data => data);

            var taikhoan = await TaiKhoanModel.getChiTietTaiKhoan(ac_helpers.getSessionUser(req).id).then(data => data);
            taikhoan[0].NgaySinh = dateFormat(new Date(taikhoan[0].NgaySinh), "dd/mm/yyyy");

            let ttDoiTac = await DoiTacModel.getChiTietDoiTac(ac_helpers.getSessionUser(req).id).then((data) => data);
            ttDoiTac[0].NgayHoatDong = dateFormat(new Date(ttDoiTac[0].NgayHoatDong), "dd/mm/yyyy");
            ttDoiTac[0].NgayThamGia = dateFormat(new Date(ttDoiTac[0].NgayThamGia), "dd/mm/yyyy");

            let dsLinhVucKinhDoanh = await DoiTacModel.getLinhVucKinhDoanh(ttDoiTac[0].ID_DoiTac);
            res.render("partner", {
                data: {
                    page: "themdichvu",
                    page_name: "Thêm dịch vụ mới",
                    year: date.getFullYear(),
                    base_url: base_url,
                    menu: menu,
                    breadcrumb: [{
                        name: "Home",
                        path: "/"
                    },
                    {
                        name: "Dịch vụ",
                        path: "/dich-vu"
                    },
                    {
                        name: "Thêm dịch vụ",
                        path: "/"
                    }
                    ],
                    taikhoan: taikhoan,
                    ttDoiTac: ttDoiTac,
                    lvkd: dsLinhVucKinhDoanh,
                    info: info
                }
            });
        }
        else
            res.redirect("/account");
    })
    .post(function (req, res) {
        try {
            var result = DoiTacModel.themDichVu(req.body.tendv, htmlencode.htmlEncode(req.body.mota), req.body.idDT);
            if (!result)
                res.json({ "Messenger": "Đã có lỗi xảy ra" });
            else
                result.then(function (dt) {
                    res.redirect("/dich-vu");
                }).catch(function (err) {
                    res.json({ "Messenger": err });
                })
        }
        catch (e) {
            res.json({ "Messenger": e });
        }
    });
router.route("/dich-vu/:id/sua")
    .get(async function (req, res) {
        if (ac_helpers.kiemTraDangNhap(req)) {
            var info = await HeThongModel.getThongTinHeThong().then(data => data);

            var taikhoan = await TaiKhoanModel.getChiTietTaiKhoan(ac_helpers.getSessionUser(req).id).then(data => data);
            taikhoan[0].NgaySinh = dateFormat(new Date(taikhoan[0].NgaySinh), "dd/mm/yyyy");

            let ttDoiTac = await DoiTacModel.getChiTietDoiTac(ac_helpers.getSessionUser(req).id).then((data) => data);
            ttDoiTac[0].NgayHoatDong = dateFormat(new Date(ttDoiTac[0].NgayHoatDong), "dd/mm/yyyy");
            ttDoiTac[0].NgayThamGia = dateFormat(new Date(ttDoiTac[0].NgayThamGia), "dd/mm/yyyy");

            let dsLinhVucKinhDoanh = await DoiTacModel.getLinhVucKinhDoanh(ttDoiTac[0].ID_DoiTac);
            let ctDV = await DoiTacModel.getChiTietDichVu(req.params.id);
            ctDV[0].MoTa=decode(ctDV[0].MoTa);

            res.render("partner", {
                data: {
                    page: "suadichvu",
                    page_name: "Sửa dịch vụ",
                    year: date.getFullYear(),
                    base_url: base_url,
                    menu: menu,
                    breadcrumb: [{
                        name: "Home",
                        path: "/"
                    },
                    {
                        name: "Dịch vụ",
                        path: "/dich-vu"
                    },
                    {
                        name: "Sửa dịch vụ",
                        path: "/"
                    }
                    ],
                    id: req.params.id,
                    taikhoan: taikhoan,
                    ttDoiTac: ttDoiTac,
                    lvkd: dsLinhVucKinhDoanh,
                    info: info,
                    chiTietDV: ctDV
                }
            });
        }
        else
            res.redirect("/account");
    })
    .post(function (req, res) {
        try {
            var result = DoiTacModel.capNhapDichVu(req.body.tendv, htmlencode.htmlEncode(req.body.mota), req.params.id);
            if (!result)
                res.json({ "Messenger": "Đã có lỗi xảy ra" });
            else
                result.then(function (dt) {
                    res.redirect("/dich-vu");
                }).catch(function (err) {
                    res.json({ "Messenger": err });
                });
        }
        catch (e) {
            res.json({ "Messenger": e });
        }
    });
router.route("/dich-vu/:id/xoa")
    .get(async function (req, res) {
        if (ac_helpers.kiemTraDangNhap(req)){
            try{
                var chitietdv = await DoiTacModel.xoaChiTietDichVu(req.params.id);
                var dv = await DoiTacModel.xoaDichVu(req.params.id);
                res.redirect("/dich-vu");
            }
            catch(e){
                res.json("Lỗi: xóa thất bại");
            }
        }
        else
            res.redirect("/account");
    });
router.route("/uu-dai")
    .get(async function (req, res) {
        if (ac_helpers.kiemTraDangNhap(req)) {
            var info = await HeThongModel.getThongTinHeThong().then(data => data);

            var taikhoan = await TaiKhoanModel.getChiTietTaiKhoan(ac_helpers.getSessionUser(req).id).then(data => data);
            taikhoan[0].NgaySinh = dateFormat(new Date(taikhoan[0].NgaySinh), "dd/mm/yyyy");

            let ttDoiTac = await DoiTacModel.getChiTietDoiTac(ac_helpers.getSessionUser(req).id).then((data) => data);
            ttDoiTac[0].NgayHoatDong = dateFormat(new Date(ttDoiTac[0].NgayHoatDong), "dd/mm/yyyy");
            ttDoiTac[0].NgayThamGia = dateFormat(new Date(ttDoiTac[0].NgayThamGia), "dd/mm/yyyy");

            let dsLinhVucKinhDoanh = await DoiTacModel.getLinhVucKinhDoanh(ttDoiTac[0].ID_DoiTac);
            res.render("partner", {
                data: {
                    page: "uudai",
                    page_name: "Ưu đãi",
                    year: date.getFullYear(),
                    base_url: base_url,
                    menu: menu,
                    breadcrumb: [{
                        name: "Home",
                        path: "/"
                    },
                    {
                        name: "Ưu đãi",
                        path: "/uu-dai"
                    }
                    ],
                    taikhoan: taikhoan,
                    ttDoiTac: ttDoiTac,
                    lvkd: dsLinhVucKinhDoanh,
                    info: info
                }
            });
        }
        else
            res.redirect("/account");
    });
router.route("/uu-dai/them")
    .get(async function (req, res) {
        if (ac_helpers.kiemTraDangNhap(req)) {
            var info = await HeThongModel.getThongTinHeThong().then(data => data);

            var taikhoan = await TaiKhoanModel.getChiTietTaiKhoan(ac_helpers.getSessionUser(req).id).then(data => data);
            taikhoan[0].NgaySinh = dateFormat(new Date(taikhoan[0].NgaySinh), "dd/mm/yyyy");

            let ttDoiTac = await DoiTacModel.getChiTietDoiTac(ac_helpers.getSessionUser(req).id).then((data) => data);
            ttDoiTac[0].NgayHoatDong = dateFormat(new Date(ttDoiTac[0].NgayHoatDong), "dd/mm/yyyy");
            ttDoiTac[0].NgayThamGia = dateFormat(new Date(ttDoiTac[0].NgayThamGia), "dd/mm/yyyy");

            let dsLinhVucKinhDoanh = await DoiTacModel.getLinhVucKinhDoanh(ttDoiTac[0].ID_DoiTac);
            res.render("partner", {
                data: {
                    page: "themuudai",
                    page_name: "Thêm ưu đãi mới",
                    year: date.getFullYear(),
                    base_url: base_url,
                    menu: menu,
                    breadcrumb: [{
                        name: "Home",
                        path: "/"
                    },
                    {
                        name: "Ưu đãi",
                        path: "/uu-dai"
                    },
                    {
                        name: "Thêm ưu đãi",
                        path: "/"
                    }
                    ],
                    taikhoan: taikhoan,
                    ttDoiTac: ttDoiTac,
                    lvkd: dsLinhVucKinhDoanh,
                    info: info
                }
            });
        }
        else
            res.redirect("/account");
    });
router.route("/uu-dai/:id/sua")
    .get(async function (req, res) {
        if (ac_helpers.kiemTraDangNhap(req)) {
            var info = await HeThongModel.getThongTinHeThong().then(data => data);

            var taikhoan = await TaiKhoanModel.getChiTietTaiKhoan(ac_helpers.getSessionUser(req).id).then(data => data);
            taikhoan[0].NgaySinh = dateFormat(new Date(taikhoan[0].NgaySinh), "dd/mm/yyyy");

            let ttDoiTac = await DoiTacModel.getChiTietDoiTac(ac_helpers.getSessionUser(req).id).then((data) => data);
            ttDoiTac[0].NgayHoatDong = dateFormat(new Date(ttDoiTac[0].NgayHoatDong), "dd/mm/yyyy");
            ttDoiTac[0].NgayThamGia = dateFormat(new Date(ttDoiTac[0].NgayThamGia), "dd/mm/yyyy");

            let dsLinhVucKinhDoanh = await DoiTacModel.getLinhVucKinhDoanh(ttDoiTac[0].ID_DoiTac);
            res.render("partner", {
                data: {
                    page: "suauudai",
                    page_name: "Sửa ưu đãi",
                    year: date.getFullYear(),
                    base_url: base_url,
                    menu: menu,
                    breadcrumb: [{
                        name: "Home",
                        path: "/"
                    },
                    {
                        name: "Ưu đãi",
                        path: "/uu-dai"
                    },
                    {
                        name: "Sửa ưu đãi",
                        path: "/"
                    }
                    ],
                    id: req.params.id,
                    taikhoan: taikhoan,
                    ttDoiTac: ttDoiTac,
                    lvkd: dsLinhVucKinhDoanh,
                    info: info
                }
            });
        }
        else
            res.redirect("/account");
    });
router.route("/uu-dai/:id/xoa")
    .get(async function (req, res) {
        if (ac_helpers.kiemTraDangNhap(req))
            res.json({
                data: "Xóa " + req.params.id + " thành công"
            });
        else
            res.redirect("/account");
    });
module.exports = router;