import React from "react";

const NhanVienItem = ({
  maNV,
  tenNV,
  phai,
  noiSinh,
  luong,
  phongBan,
  isAdmin,
  onDeleteClick,
  onUpdateClick,
}) => {
  return (
    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {maNV}
      </th>
      <td className="px-6 py-4">{tenNV}</td>
      <td className="px-6 py-4">
        {phai === "NU" ? (
          <i className="fa-solid fa-venus text-2xl"></i>
        ) : (
          <i className="fa-solid fa-mars text-2xl"></i>
        )}
      </td>
      <td className="px-6 py-4">{noiSinh}</td>
      <td className="px-6 py-4">{phongBan?.tenPhong}</td>
      <td className="px-6 py-4">{luong}</td>
      {isAdmin && (
        <td className="px-6 py-4 flex gap-x-2">
          <button
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              if (onUpdateClick) {
                onUpdateClick({ maNV, tenNV, phai, noiSinh, luong, phongBan });
              }
            }}
          >
            Edit
          </button>
          <button
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              if (onDeleteClick) {
                onDeleteClick(maNV, tenNV);
              }
            }}
          >
            Delete
          </button>
        </td>
      )}
    </tr>
  );
};

export default NhanVienItem;
