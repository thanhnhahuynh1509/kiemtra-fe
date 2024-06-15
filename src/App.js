import { useEffect, useState } from "react";
import {
  deleteNhanVien,
  getSize,
  listNhanVien,
  saveNhanVien,
  updateNhanVien,
} from "./api/nhanvien";
import NhanVienItem from "./components/NhanVienItem";
import { logging } from "./api/nguoidung";

function App() {
  const [nguoiDung, setNguoiDung] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [nhanViens, setNhanViens] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [onAddModal, setOnAddModal] = useState(false);
  const [onDeleteModal, setOnDeleteModal] = useState(false);
  const [onUpdateModal, setOnUpdateModal] = useState(false);
  const [maNV, setMaNV] = useState("");
  const [tenNV, setTenNV] = useState("");
  const [phai, setPhai] = useState("");
  const [noiSinh, setNoiSinh] = useState("");
  const [luong, setLuong] = useState("");
  const [maPhong, setMaPhong] = useState("");

  useEffect(() => {
    const init = async () => {
      const size = await getSize();
      setTotal(size);
    };

    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      const nhanvien = await listNhanVien(currentPage);
      setNhanViens(nhanvien);
    };

    init();
  }, [currentPage]);

  const onAddNhanVien = async () => {
    const nhanVien = {
      maNV,
      tenNV,
      phai,
      noiSinh,
      luong,
      phongBan: { maPhong },
    };
    const response = await saveNhanVien(nhanVien);
    setNhanViens((prev) => [...prev, response]);
    setOnAddModal(false);
  };

  if (!nguoiDung) {
    return (
      <div className="p-6 w-[500px]">
        <form>
          <div class="mb-6">
            <label
              for="email"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Username
            </label>
            <input
              type="text"
              id="email"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="john.doe@company.com"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              required
            />
          </div>
          <div class="mb-6">
            <label
              for="password"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="•••••••••"
              required
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>

          <button
            type="button"
            onClick={async (e) => {
              const nguoidung = await logging(username, password);
              console.log(nguoidung);
              if (!nguoidung) {
                alert("Username or password may be not correct!");
                return;
              }
              setNguoiDung(nguoidung);
            }}
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="App flex flex-col mt-6 p-6">
        <div className="ml-auto my-6">
          <button
            className="rounded-md bg-green-700 py-2 px-2 text-white font-medium hover:bg-green-800 transition"
            onClick={() => {
              setOnAddModal(true);
            }}
          >
            Thêm Nhân Viên
          </button>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-6">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Mã Nhân Viên
                </th>
                <th scope="col" className="px-6 py-3">
                  Tên Nhân Viên
                </th>
                <th scope="col" className="px-6 py-3">
                  Giới Tính
                </th>
                <th scope="col" className="px-6 py-3">
                  Nơi Sinh
                </th>
                <th scope="col" className="px-6 py-3">
                  Tên Phòng
                </th>
                <th scope="col" className="px-6 py-3">
                  Lương
                </th>
                {nguoiDung?.role === "admin" && (
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {nhanViens?.map((nhanVien) => {
                return (
                  <NhanVienItem
                    key={nhanVien?.maNV}
                    {...nhanVien}
                    onDeleteClick={(maNV, tenNV) => {
                      setMaNV(maNV);
                      setTenNV(tenNV);
                      setOnDeleteModal(true);
                    }}
                    onUpdateClick={(nv) => {
                      setMaNV(nv.maNV);
                      setTenNV(nv.tenNV);
                      setPhai(nv.phai);
                      setNoiSinh(nv.noiSinh);
                      setLuong(nv.luong);
                      setMaPhong(nv.phongBan.maPhong);
                      setOnUpdateModal(true);
                    }}
                    isAdmin={nguoiDung?.role === "admin"}
                  />
                );
              })}
            </tbody>
          </table>
          <nav
            className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
            aria-label="Table navigation"
          >
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
              Showing{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {currentPage} - {currentPage * 5}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {total}
              </span>
            </span>
            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
              {Array.from(Array(Math.ceil(total / 5)), (e, i) => {
                return (
                  <li key={i}>
                    <button
                      onClick={(e) => {
                        setCurrentPage(i + 1);
                      }}
                      className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                        currentPage === i + 1
                          ? "bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                          : ""
                      }`}
                    >
                      {i + 1}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      <div
        id="default-modal"
        tabindex="-1"
        class={`${
          onAddModal ? "" : "hidden"
        } w-[100vw] h-[100vh] overflow-y-auto bg-black/40 overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center md:inset-0 max-h-full`}
        onClick={() => {
          setOnAddModal(false);
        }}
      >
        <div
          class="relative top-10  left-1/2 -translate-x-1/2 p-4 w-full max-w-2xl max-h-full"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                Thêm Nhân Viên
              </h3>
              <button
                type="button"
                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="default-modal"
                onClick={() => setOnAddModal(false)}
              >
                <svg
                  class="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
            </div>
            <div class="p-4 md:p-5 space-y-4">
              <form>
                <div class="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <label
                      for="first_name"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Mã Nhân Viên
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="A01"
                      onChange={(e) => setMaNV(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="last_name"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Tên Nhân Viên
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Trần Thị B"
                      onChange={(e) => setTenNV(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="company"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Phái
                    </label>
                    <input
                      type="text"
                      id="company"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="NU"
                      required
                      onChange={(e) => setPhai(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      for="phone"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Nơi Sinh
                    </label>
                    <input
                      type="text"
                      id="phone"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Bình Định, Việt Nam"
                      required
                      onChange={(e) => setNoiSinh(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      for="website"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Lương
                    </label>
                    <input
                      type="number"
                      id="website"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="100"
                      required
                      onChange={(e) => setLuong(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      for="visitors"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Mã Phòng
                    </label>
                    <input
                      type="text"
                      id="visitors"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="KT"
                      required
                      onChange={(e) => setMaPhong(e.target.value)}
                    />
                  </div>
                </div>
              </form>
            </div>
            <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                data-modal-hide="default-modal"
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={onAddNhanVien}
              >
                Thêm
              </button>
              <button
                data-modal-hide="default-modal"
                type="button"
                class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={() => setOnAddModal(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        id="default-modal"
        tabindex="-1"
        class={`${
          onDeleteModal ? "" : "hidden"
        } w-[100vw] h-[100vh] overflow-y-auto bg-black/40 overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center md:inset-0 max-h-full`}
        onClick={() => {
          setOnDeleteModal(false);
        }}
      >
        <div
          class="relative top-10  left-1/2 -translate-x-1/2 p-4 w-full max-w-2xl max-h-full"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                Xóa nhân viên {maNV}?
              </h3>
              <button
                type="button"
                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="default-modal"
                onClick={() => setOnAddModal(false)}
              >
                <svg
                  class="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
            </div>
            <div class="p-4 md:p-5 space-y-4">
              Bạn có chắc chắn muốn xóa nhân viên <strong>{tenNV}</strong>?
            </div>
            <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                data-modal-hide="default-modal"
                type="button"
                class="text-white bg-rose-700 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-rose-600 dark:hover:bg-rose-700 dark:focus:ring-rose-800"
                onClick={async () => {
                  await deleteNhanVien(maNV);
                  setNhanViens((prev) => prev.filter((nv) => nv.maNV !== maNV));
                  setOnDeleteModal(false);
                }}
              >
                Xóa
              </button>
              <button
                data-modal-hide="default-modal"
                type="button"
                class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={() => setOnDeleteModal(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        id="default-modal"
        tabindex="-1"
        class={`${
          onUpdateModal ? "" : "hidden"
        } w-[100vw] h-[100vh] overflow-y-auto bg-black/40 overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center md:inset-0 max-h-full`}
        onClick={() => {
          setOnAddModal(false);
        }}
      >
        <div
          class="relative top-10  left-1/2 -translate-x-1/2 p-4 w-full max-w-2xl max-h-full"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                Chỉnh Sữa Nhân Viên
              </h3>
              <button
                type="button"
                class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="default-modal"
                onClick={() => setOnUpdateModal(false)}
              >
                <svg
                  class="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span class="sr-only">Close modal</span>
              </button>
            </div>
            <div class="p-4 md:p-5 space-y-4">
              <form>
                <div class="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <label
                      for="first_name"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Mã Nhân Viên
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="A01"
                      value={maNV}
                      onChange={(e) => setMaNV(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="last_name"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Tên Nhân Viên
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Trần Thị B"
                      onChange={(e) => setTenNV(e.target.value)}
                      value={tenNV}
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="company"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Phái
                    </label>
                    <input
                      type="text"
                      id="company"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="NU"
                      required
                      value={phai}
                      onChange={(e) => setPhai(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      for="phone"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Nơi Sinh
                    </label>
                    <input
                      type="text"
                      id="phone"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Bình Định, Việt Nam"
                      required
                      value={noiSinh}
                      onChange={(e) => setNoiSinh(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      for="website"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Lương
                    </label>
                    <input
                      type="number"
                      id="website"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="100"
                      required
                      value={luong}
                      onChange={(e) => setLuong(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      for="visitors"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Mã Phòng
                    </label>
                    <input
                      type="text"
                      id="visitors"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="KT"
                      required
                      value={maPhong}
                      onChange={(e) => setMaPhong(e.target.value)}
                    />
                  </div>
                </div>
              </form>
            </div>
            <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                data-modal-hide="default-modal"
                type="button"
                class="text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"
                onClick={async () => {
                  const nhanVien = {
                    maNV,
                    tenNV,
                    phai,
                    noiSinh,
                    luong,
                    phongBan: { maPhong },
                  };
                  const response = await updateNhanVien(nhanVien);
                  setNhanViens((prev) =>
                    prev.map((item) => {
                      if (item.maNV === response.maNV) {
                        return response;
                      }
                      return item;
                    })
                  );
                  setOnUpdateModal(false);
                }}
              >
                Chỉnh sữa
              </button>
              <button
                data-modal-hide="default-modal"
                type="button"
                class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                onClick={() => setOnUpdateModal(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
