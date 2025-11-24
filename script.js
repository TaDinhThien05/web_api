const DUONG_DAN_API = "https://jsonplaceholder.typicode.com/users";
const danhSachThanhVien = document.getElementById("danh-sach-thanh-vien");
const formThemThanhVien = document.getElementById("form-them-thanh-vien");
const hopThoaiChinhSua = document.getElementById("hop-thoai-chinh-sua");
const formChinhSuaThanhVien = document.getElementById("form-chinh-sua-thanh-vien");
const oTimKiem = document.getElementById("o-tim-kiem");
const nutTimKiem = document.getElementById("nut-tim-kiem");
const dieuKhienPhanTrang = document.getElementById("dieu-khien-phan-trang");
const thongBaoLoi = document.getElementById("thong-bao-loi");

let tatCaThanhVien = [];
let trangHienTai = 1;
const soThanhVienMoiTrang = 5;

function xuLyLoi(loi) {
  console.error("Lỗi API:", loi);
  thongBaoLoi.textContent = `Đã xảy ra lỗi: ${loi.message}. Vui lòng thử lại.`;
  setTimeout(() => {
    thongBaoLoi.textContent = "";
  }, 5000);
}

async function layDanhSachThanhVien() {
  try {
    const phanHoi = await fetch(DUONG_DAN_API);
    if (!phanHoi.ok) {
      throw new Error(`Lỗi HTTP: ${phanHoi.status}`);
    }
    tatCaThanhVien = await phanHoi.json();
    hienThiBang(tatCaThanhVien, trangHienTai);
    hienThiPhanTrang(tatCaThanhVien.length);
  } catch (loi) {
    xuLyLoi(loi);
  }
}

function hienThiBang(thanhVien, trang) {
  danhSachThanhVien.innerHTML = "";

  const chiSoBatDau = (trang - 1) * soThanhVienMoiTrang;
  const chiSoKetThuc = chiSoBatDau + soThanhVienMoiTrang;
  const thanhVienPhanTrang = thanhVien.slice(chiSoBatDau, chiSoKetThuc);

  if (thanhVienPhanTrang.length === 0 && thanhVien.length > 0) {
    trangHienTai = 1;
    hienThiBang(thanhVien, trangHienTai);
    return;
  }

  if (thanhVien.length === 0) {
    danhSachThanhVien.innerHTML =
      '<tr><td colspan="4">Không tìm thấy thành viên nào.</td></tr>';
    return;
  }

  thanhVienPhanTrang.forEach((thanhVien) => {
    const hang = danhSachThanhVien.insertRow();
    hang.dataset.id = thanhVien.id;

    hang.insertCell().textContent = thanhVien.name;
    hang.insertCell().textContent = thanhVien.email;
    hang.insertCell().textContent = thanhVien.phone;

    const oThaoTac = hang.insertCell();
    oThaoTac.className = "action-buttons";
    oThaoTac.innerHTML = `
            <button class="edit-btn" onclick="moHopThoaiChinhSua(${
              thanhVien.id
            }, '${thanhVien.name.replace(/'/g, "\\'")}', '${thanhVien.email.replace(
      /'/g,
      "\\'"
    )}', '${thanhVien.phone.replace(/'/g, "\\'")}')">Sửa</button>
            <button class="delete-btn" onclick="xoaThanhVien(${
              thanhVien.id
            })">Xóa</button>
        `;
  });
}

function hienThiPhanTrang(tongSoThanhVien) {
  dieuKhienPhanTrang.innerHTML = "";
  const tongSoTrang = Math.ceil(tongSoThanhVien / soThanhVienMoiTrang);

  for (let i = 1; i <= tongSoTrang; i++) {
    const nut = document.createElement("button");
    nut.textContent = i;
    nut.className = i === trangHienTai ? "current-page" : "";
    nut.addEventListener("click", () => {
      trangHienTai = i;
      const thanhVienCanHienThi = oTimKiem.value
        ? locThanhVienTheoTen(oTimKiem.value)
        : tatCaThanhVien;
      hienThiBang(thanhVienCanHienThi, trangHienTai);
      hienThiPhanTrang(thanhVienCanHienThi.length);
    });
    dieuKhienPhanTrang.appendChild(nut);
  }
}

function locThanhVienTheoTen(tuKhoaTimKiem) {
  const timKiemChuThuong = tuKhoaTimKiem.toLowerCase().trim();
  if (!timKiemChuThuong) {
    return tatCaThanhVien;
  }
  return tatCaThanhVien.filter((thanhVien) =>
    thanhVien.name.toLowerCase().includes(timKiemChuThuong)
  );
}

nutTimKiem.addEventListener("click", () => {
  const tuKhoaTimKiem = oTimKiem.value;
  const thanhVienDaLoc = locThanhVienTheoTen(tuKhoaTimKiem);
  trangHienTai = 1;
  hienThiBang(thanhVienDaLoc, trangHienTai);
  hienThiPhanTrang(thanhVienDaLoc.length);
});

formThemThanhVien.addEventListener("submit", async (e) => {
  e.preventDefault();

  const hoTen = document.getElementById("ho-ten").value;
  const thuDienTu = document.getElementById("thu-dien-tu").value;
  const soDienThoai = document.getElementById("so-dien-thoai").value;

  const thanhVienMoi = {
    name: hoTen,
    email: thuDienTu,
    phone: soDienThoai,
  };

  try {
    const phanHoi = await fetch(DUONG_DAN_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(thanhVienMoi),
    });

    if (!phanHoi.ok) {
      throw new Error(`Lỗi HTTP: ${phanHoi.status}`);
    }

    const thanhVienDaThem = await phanHoi.json();

    thanhVienDaThem.id = Date.now();

    tatCaThanhVien.push(thanhVienDaThem);
    formThemThanhVien.reset();

    const thanhVienCanHienThi = oTimKiem.value
      ? locThanhVienTheoTen(oTimKiem.value)
      : tatCaThanhVien;
    hienThiBang(thanhVienCanHienThi, trangHienTai);
    hienThiPhanTrang(thanhVienCanHienThi.length);

    alert(
      `Thành viên "${thanhVienDaThem.name}" đã được thêm thành công (ID ảo: ${thanhVienDaThem.id})!`
    );
  } catch (loi) {
    xuLyLoi(loi);
  }
});

function moHopThoaiChinhSua(ma, hoTen, thuDienTu, soDienThoai) {
  document.getElementById("ma-chinh-sua").value = ma;
  document.getElementById("ho-ten-chinh-sua").value = hoTen;
  document.getElementById("thu-dien-tu-chinh-sua").value = thuDienTu;
  document.getElementById("so-dien-thoai-chinh-sua").value = soDienThoai;
  hopThoaiChinhSua.style.display = "block";
}

document.querySelector(".close-button").addEventListener("click", () => {
  hopThoaiChinhSua.style.display = "none";
});

window.addEventListener("click", (sukien) => {
  if (sukien.target === hopThoaiChinhSua) {
    hopThoaiChinhSua.style.display = "none";
  }
});

formChinhSuaThanhVien.addEventListener("submit", async (e) => {
  e.preventDefault();

  const ma = parseInt(document.getElementById("ma-chinh-sua").value);
  const hoTen = document.getElementById("ho-ten-chinh-sua").value;
  const thuDienTu = document.getElementById("thu-dien-tu-chinh-sua").value;
  const soDienThoai = document.getElementById("so-dien-thoai-chinh-sua").value;

  const thanhVienCapNhat = {
    id: ma,
    name: hoTen,
    email: thuDienTu,
    phone: soDienThoai,
  };

  try {
    const phanHoi = await fetch(`${DUONG_DAN_API}/${ma}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(thanhVienCapNhat),
    });

    if (!phanHoi.ok) {
      throw new Error(`Lỗi HTTP: ${phanHoi.status}`);
    }

    const viTriThanhVien = tatCaThanhVien.findIndex((thanhVien) => thanhVien.id === ma);
    if (viTriThanhVien > -1) {
      tatCaThanhVien[viTriThanhVien].name = thanhVienCapNhat.name;
      tatCaThanhVien[viTriThanhVien].email = thanhVienCapNhat.email;
      tatCaThanhVien[viTriThanhVien].phone = thanhVienCapNhat.phone;
    }

    hopThoaiChinhSua.style.display = "none";
    const thanhVienCanHienThi = oTimKiem.value
      ? locThanhVienTheoTen(oTimKiem.value)
      : tatCaThanhVien;
    hienThiBang(thanhVienCanHienThi, trangHienTai);
    hienThiPhanTrang(thanhVienCanHienThi.length);

    alert(`Thành viên ID ${ma} đã được cập nhật thành công!`);
  } catch (loi) {
    xuLyLoi(loi);
  }
});

async function xoaThanhVien(ma) {
  if (!confirm(`Bạn có chắc chắn muốn xóa thành viên ID ${ma}?`)) {
    return;
  }

  try {
    const phanHoi = await fetch(`${DUONG_DAN_API}/${ma}`, {
      method: "DELETE",
    });

    if (!phanHoi.ok) {
      throw new Error(`Lỗi HTTP: ${phanHoi.status}`);
    }

    tatCaThanhVien = tatCaThanhVien.filter((thanhVien) => thanhVien.id !== ma);

    const thanhVienCanHienThi = oTimKiem.value
      ? locThanhVienTheoTen(oTimKiem.value)
      : tatCaThanhVien;

    const tongSoTrangSauKhiXoa = Math.ceil(
      thanhVienCanHienThi.length / soThanhVienMoiTrang
    );
    if (trangHienTai > tongSoTrangSauKhiXoa && tongSoTrangSauKhiXoa > 0) {
      trangHienTai = tongSoTrangSauKhiXoa;
    }

    hienThiBang(thanhVienCanHienThi, trangHienTai);
    hienThiPhanTrang(thanhVienCanHienThi.length);

    alert(`Thành viên ID ${ma} đã được xóa thành công!`);
  } catch (loi) {
    xuLyLoi(loi);
  }
}

document.addEventListener("DOMContentLoaded", layDanhSachThanhVien);