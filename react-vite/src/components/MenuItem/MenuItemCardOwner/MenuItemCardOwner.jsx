import { useEffect, useState } from "react";
import OpenModalButton from "../../OpenModalButton/OpenModalButton";
import MenuItemDeleteModal from "../MenuItemDeleteModal/MenuItemDeleteModal";
import MenuItemFormUpdate from "../MenuItemFormUpdate/MenuItemFormUpdate";
import "./MenuItemCardOwner.css";

export default function MenuItemCardOwner({ menuItem }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    isLoaded && (
      <div className="menu-item-card-owner">
        <img
          src={menuItem.image_url}
          alt={menuItem.name}
          className="menu-item-img"
        />
        <div className="menu-item-name">{menuItem.name}</div>
        <div className="menu-item-price">${menuItem.price}</div>

        <div className="menu-item-owner-buttons">
          <OpenModalButton
            buttonText="Edit"
            className="edit-menu-item-btn"
            modalComponent={<MenuItemFormUpdate menuItem={menuItem} />}
          />
          <OpenModalButton
            buttonText="Delete"
            className="delete-menu-item-btn"
            modalComponent={<MenuItemDeleteModal menuItemId={menuItem.id} />}
          />
        </div>
      </div>
    )
  );
}
