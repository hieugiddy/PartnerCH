var q = require("q");
var db = require("../common/DB");
var conn = db.getConnection();


function getDSLoaiHinh() {
    var defer = q.defer();
    conn.query('SELECT * FROM loaihinhkinhdoanh ', function (error, results, fields) {
        if (error)
            defer.reject(error);
        else
            defer.resolve(results);
    });

    return defer.promise;
}

function getLVKDChuaChon(iddt) {
    var defer = q.defer();
    conn.query('SELECT * FROM linhvuckinhdoanh WHERE ID_LinhVuc NOT IN (SELECT ID_LinhVuc FROM chitietlinhvuckinhdoanh WHERE ID_DoiTac=?) ', iddt, function (error, results, fields) {
        if (error)
            defer.reject(error);
        else
            defer.resolve(results);
    });

    return defer.promise;
}

function getChiTietDoiTac(id) {
    if (id) {
        var defer = q.defer();
        conn.query('SELECT * FROM doitac, loaihinhkinhdoanh WHERE doitac.IDLoaiHinh=loaihinhkinhdoanh.IDLoaiHinh and IDTK=?', id, function (error, results, fields) {
            if (error)
                defer.reject(error);
            else
                defer.resolve(results);
        });

        return defer.promise;
    }

    return false;
}

function getDsChiNhanh(idDT) {
    if (idDT) {
        var defer = q.defer();
        conn.query('SELECT * FROM chinhanh WHERE ID_DoiTac=?', idDT, function (error, results, fields) {
            if (error)
                defer.reject(error);
            else
                defer.resolve(results);
        });

        return defer.promise;
    }

    return false;
}
function getDiemDanhGia(idChiNhanh) {
    if (idChiNhanh) {
        var defer = q.defer();
        conn.query('SELECT AVG(Diem) AS Diem FROM danhgia WHERE ID_ChiNhanh=?', idChiNhanh, function (error, results, fields) {
            if (error)
                defer.reject(error);
            else
                defer.resolve(results);
        });

        return defer.promise;
    }

    return false;
}
function getLinhVucKinhDoanh(idDoiTac) {
    if (idDoiTac) {
        var defer = q.defer();
        conn.query('SELECT lvkd.ID_LinhVuc, TenLinhVuc FROM linhvuckinhdoanh as lvkd, chitietlinhvuckinhdoanh as ctlvkd WHERE lvkd.ID_LinhVuc=ctlvkd.ID_LinhVuc and ID_DoiTac=?', idDoiTac, function (error, results, fields) {
            if (error)
                defer.reject(error);
            else
                defer.resolve(results);
        });

        return defer.promise;
    }

    return false;
}
function getHinhAnh(idDoiTac, loai, limit) {
    if (idDoiTac) {
        var defer = q.defer();
        conn.query('SELECT * FROM hinhanhdoitac WHERE ID_DoiTac=? AND LoaiAnh=?', [idDoiTac, loai], function (error, results, fields) {
            if (error)
                defer.reject(error);
            else
                defer.resolve(results);
        });

        return defer.promise;
    }

    return false;
}
function getDichVu(ID_DoiTac) {
    if (ID_DoiTac) {
        var defer = q.defer();
        conn.query('SELECT * FROM dichvu WHERE ID_DoiTac=?', [ID_DoiTac], function (error, results, fields) {
            if (error)
                defer.reject(error);
            else
                defer.resolve(results);
        });

        return defer.promise;
    }

    return false;
}
function getChiTietDichVu(idDichVu) {
    if (idDichVu) {
        var defer = q.defer();
        conn.query('SELECT * FROM dichvu WHERE ID_DichVu=?', [idDichVu], function (error, results, fields) {
            if (error)
                defer.reject(error);
            else
                defer.resolve(results);
        });

        return defer.promise;
    }

    return false;
}
function getUuDai(idDoiTac) {
    if (idDoiTac) {
        var defer = q.defer();
        conn.query('SELECT * FROM uudai WHERE TgKetThuc>=NOW() AND ID_DoiTac=?', [idDoiTac], function (error, results, fields) {
            if (error)
                defer.reject(error);
            else
                defer.resolve(results);
        });

        return defer.promise;
    }

    return false;
}
function getChiTietUuDai(idUuDai) {
    if (idUuDai) {
        var defer = q.defer();
        conn.query('SELECT * FROM uudai WHERE ID_UuDai=?', [idUuDai], function (error, results, fields) {
            if (error)
                defer.reject(error);
            else
                defer.resolve(results);
        });

        return defer.promise;
    }

    return false;
}
function getDanhGia(idChiNhanh) {
    if (idChiNhanh) {
        var defer = q.defer();
        conn.query('SELECT * FROM danhgia, taikhoan WHERE danhgia.ID_TaiKhoan=taikhoan.ID_TaiKhoan AND danhgia.ID_ChiNhanh=?', [idChiNhanh], function (error, results, fields) {
            if (error)
                defer.reject(error);
            else
                defer.resolve(results);
        });

        return defer.promise;
    }

    return false;
}

function dsYeuCauCuuHo(ID_TaiKhoan, TrangThai) {
    var TrangThai = TrangThai.split(',');
    var defer = q.defer();
    conn.query("SELECT * FROM yeucaucuuho WHERE TrangThai IN (?) AND ID_ChiNhanh=(SELECT ID_ChiNhanh FROM taikhoan WHERE ID_TaiKhoan=?) ORDER BY ThoiGian DESC", [TrangThai, ID_TaiKhoan], function (error, results) {
        if (error)
            defer.reject(error);
        else
            defer.resolve(results);
    });

    return defer.promise;
}

function getChiTietYeuCau(ID_YeuCau) {
    var defer = q.defer();
    conn.query('SELECT * FROM yeucaucuuho, taikhoan WHERE yeucaucuuho.ID_TaiKhoan=taikhoan.ID_TaiKhoan AND ID_YeuCau=?', [ID_YeuCau], function (error, results, fields) {
        if (error)
            defer.reject(error);
        else
            defer.resolve(results);
    });

    return defer.promise;
}

function capNhatTaiKhoan(taikhoan, ID_TaiKhoan) {
    var defer = q.defer();
    conn.query('UPDATE taikhoan SET ? WHERE ID_TaiKhoan=?', [taikhoan, ID_TaiKhoan], function (error, results, fields) {
        if (error)
            defer.reject(error);
        else
            defer.resolve(results);
    });

    return defer.promise;
}
function capNhapDoiTac(doitac, ID_DoiTac) {
    var defer = q.defer();
    conn.query('UPDATE doitac SET ? WHERE ID_DoiTac=?', [doitac, ID_DoiTac], function (error, results, fields) {
        if (error)
            defer.reject(error);
        else
            defer.resolve(results);
    });

    return defer.promise;
}
function xoaLinhVucKD(ID_DoiTac) {
    var defer = q.defer();
    conn.query('DELETE FROM chitietlinhvuckinhdoanh WHERE ID_DoiTac=?', ID_DoiTac, function (error, results, fields) {
        if (error)
            defer.reject(error);
        else
            defer.resolve(results);
    });

    return defer.promise;
}
function themLinhVucKD(ID_LinhVuc,ID_DoiTac) {
    var defer = q.defer();
    conn.query('INSERT INTO chitietlinhvuckinhdoanh SET ?', {ID_LinhVuc,ID_DoiTac}, function (error, results, fields) {
        if (error)
            defer.reject(error);
        else
            defer.resolve(results);
    });

    return defer.promise;
}
function capNhatTaiKhoan(taikhoan, ID_TaiKhoan) {
    var defer = q.defer();
    conn.query('UPDATE taikhoan SET ? WHERE ID_TaiKhoan=?', [taikhoan, ID_TaiKhoan], function (error, results, fields) {
        if (error)
            defer.reject(error);
        else
            defer.resolve(results);
    });

    return defer.promise;
}
function capNhapAnhTK(AnhMatTruocCMND,AnhMatSauCMND ,ID_TaiKhoan) {
    var defer = q.defer();
    conn.query('UPDATE taikhoan SET ? WHERE ID_TaiKhoan=?', [{AnhMatTruocCMND, AnhMatSauCMND}, ID_TaiKhoan], function (error, results, fields) {
        if (error)
            defer.reject(error);
        else
            defer.resolve(results);
    });

    return defer.promise;
}
function themAnhDoiTac(LinkAnh,LoaiAnh,ID_DoiTac) {
    var defer = q.defer();
    conn.query('INSERT INTO hinhanhdoitac SET ?', {LinkAnh, LoaiAnh, ID_DoiTac}, function (error, results, fields) {
        if (error)
            defer.reject(error);
        else
            defer.resolve(results);
    });

    return defer.promise;
}
function xoaAnhDoiTac(ID_Anh) {
    var defer = q.defer();
    conn.query('DELETE FROM hinhanhdoitac WHERE ID_Anh=?', ID_Anh, function (error, results, fields) {
        if (error)
            defer.reject(error);
        else
            defer.resolve(results);
    });

    return defer.promise;
}
function themDichVu(TenDichVu,MoTa,ID_DoiTac) {
    var defer = q.defer();
    conn.query('INSERT INTO dichvu SET ?', {TenDichVu, MoTa, ID_DoiTac}, function (error, results, fields) {
        if (error)
            defer.reject(error);
        else
            defer.resolve(results);
    });

    return defer.promise;
}
function capNhapDichVu(TenDichVu,MoTa ,ID_DichVu) {
    var defer = q.defer();
    conn.query('UPDATE dichvu SET ? WHERE ID_DichVu=?', [{TenDichVu, MoTa}, ID_DichVu], function (error, results, fields) {
        if (error)
            defer.reject(error);
        else
            defer.resolve(results);
    });

    return defer.promise;
}
function xoaChiTietDichVu(ID_DichVu) {
    var defer = q.defer();
    conn.query('DELETE FROM chitietdichvu WHERE ID_DichVu=?', ID_DichVu, function (error, results, fields) {
        if (error)
            defer.reject(error);
        else
            defer.resolve(results);
    });

    return defer.promise;
}
function xoaDichVu(ID_DichVu) {
    var defer = q.defer();
    conn.query('DELETE FROM dichvu WHERE ID_DichVu=?', ID_DichVu, function (error, results, fields) {
        if (error)
            defer.reject(error);
        else
            defer.resolve(results);
    });

    return defer.promise;
}
function themChiNhanh(chinhanh) {
    var defer = q.defer();
    conn.query('INSERT INTO chinhanh SET ?', chinhanh, function (error, results, fields) {
        if (error)
            defer.reject(error);
        else
            defer.resolve(results);
    });

    return defer.promise;
}
function themChiTietDichVu(ID_DichVu, ID_ChiNhanh) {
    var defer = q.defer();
    conn.query('INSERT INTO chitietdichvu SET ?', {ID_DichVu, ID_ChiNhanh}, function (error, results, fields) {
        if (error)
            defer.reject(error);
        else
            defer.resolve(results);
    });

    return defer.promise;
}
module.exports = {
    getChiTietDoiTac: getChiTietDoiTac,
    getDsChiNhanh: getDsChiNhanh,
    getDiemDanhGia: getDiemDanhGia,
    getLinhVucKinhDoanh: getLinhVucKinhDoanh,
    getHinhAnh: getHinhAnh,
    getDichVu: getDichVu,
    getUuDai: getUuDai,
    getDanhGia: getDanhGia,
    getChiTietDichVu: getChiTietDichVu,
    getChiTietUuDai: getChiTietUuDai,
    dsYeuCauCuuHo: dsYeuCauCuuHo,
    getChiTietYeuCau: getChiTietYeuCau,
    getLVKDChuaChon: getLVKDChuaChon,
    getDSLoaiHinh: getDSLoaiHinh,
    capNhatTaiKhoan: capNhatTaiKhoan,
    capNhapDoiTac: capNhapDoiTac,
    xoaLinhVucKD: xoaLinhVucKD,
    themLinhVucKD: themLinhVucKD,
    capNhapAnhTK: capNhapAnhTK,
    themAnhDoiTac: themAnhDoiTac,
    xoaAnhDoiTac: xoaAnhDoiTac,
    themDichVu: themDichVu,
    xoaChiTietDichVu: xoaChiTietDichVu,
    capNhapDichVu: capNhapDichVu,
    xoaDichVu: xoaDichVu,
    themChiNhanh: themChiNhanh,
    themChiTietDichVu: themChiTietDichVu
}