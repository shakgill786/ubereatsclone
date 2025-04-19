import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteMenuItemThunk } from "../../../redux/menuItems";
import "./MenuItemDeleteModal.css";

export default function MenuItemDeleteModal({ menuItemId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const menuItems = useSelector((state) => state.menuItems.allMenuItems);
  const currentItem = menuItems.find((item) => item.id === menuItemId);

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(deleteMenuItemThunk(menuItemId));
      if (res?.message || res?.success) {
        closeModal();
      } else {
        console.error("Menu item deletion failed:", res);
      }
    } catch (err) {
      console.error("Error deleting menu item:", err);
    }
  };

  return (
    <div id="menu-item-delete-modal-outermost-box">
      <div id="menu-item-delete-modal-text">
        Delete <strong>{currentItem?.name || "this item"}</strong>?
      </div>
      <div style={{ display: "flex", gap: "10px", marginTop: "20px", justifyContent: "center" }}>
        <button onClick={closeModal} id="menu-item-cancel-delete-btn">
          No, Save
        </button>
        <button onClick={handleDelete} id="menu-item-confirm-delete-btn">
          Yes, Delete
        </button>
      </div>
    </div>
  );
}
