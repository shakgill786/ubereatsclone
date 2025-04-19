import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal"; // ✅ Corrected path
import { deleteImageFileMenuItem } from "../../../redux/image";
import { deleteMenuItemThunk } from "../../../redux/menuItems";
import "./MenuItemDeleteModal.css";

export default function MenuItemDeleteModal({ menuItemId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const resDeleteImg = await dispatch(deleteImageFileMenuItem(menuItemId));
      const res = await dispatch(deleteMenuItemThunk(menuItemId));
      if (resDeleteImg.message && res.message) {
        closeModal();
      }
    } catch (err) {
      console.error("Error deleting menu item:", err);
    }
  };

  return (
    <div id="menu-item-delete-modal-outermost-box">
      <div id="menu-item-delete-modal-text">Delete menu item?</div>
      <div>
        <button onClick={closeModal} id="menu-item-cancel-delete-btn">
          No, Save
        </button>
      </div>
      <div>
        <button onClick={handleDelete} id="menu-item-confirm-delete-btn">
          Yes, Delete
        </button>
      </div>
    </div>
  );
}
