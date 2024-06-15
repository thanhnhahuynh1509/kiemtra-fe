import axios from "axios";

const HOST = "http://localhost:8080";

export const listNhanVien = async (currentPage) => {
  const response = await axios.get(
    `${HOST}/api/nhanvien?page=${currentPage || 1}`
  );

  return response.data;
};

export const saveNhanVien = async (nhanVien) => {
  const response = await axios.post(`${HOST}/api/nhanvien`, nhanVien);

  return response.data;
};

export const updateNhanVien = async (nhanVien) => {
  const response = await axios.put(
    `${HOST}/api/nhanvien/${nhanVien.maNV}`,
    nhanVien
  );

  return response.data;
};

export const deleteNhanVien = async (maNV) => {
  const response = await axios.delete(`${HOST}/api/nhanvien/${maNV}`);
  return response.data;
};

export const getSize = async () => {
  const response = await axios.get(`${HOST}/api/nhanvien/size`);
  return response.data;
};
