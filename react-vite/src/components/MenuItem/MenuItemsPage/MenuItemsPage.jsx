import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMenuItemsForRestaurantThunk } from "../../../redux/menuItems";
import MenuItemCard from "../MenuItemCard/MenuItemCard";
import ShoppingCartModal from "../../ShoppingCart/ShoppingCart";
import OpenModalButton from "../../OpenModalButton/OpenModalButton";
import MenuItemForm from "../MenuItemForm/MenuItemForm";
import "./MenuItemsPage.css";

export default function MenuItemsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const menuItems = useSelector(state => state.menuItems.allMenuItems || []);

  useEffect(() => {
    dispatch(getMenuItemsForRestaurantThunk(id));
  }, [dispatch, id]);

  const groupedItems = menuItems.reduce((acc, item) => {
    const type = item.type?.charAt(0).toUpperCase() + item.type.slice(1) || "Other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {});

  return (
    <div className="menu-items-page-container">
      <div className="menu-items-header">
        <h2>Menu</h2>

        <OpenModalButton
          buttonText="+ Create Menu Item"
          modalComponent={
            <MenuItemForm
              formType="Create Menu Item"
              menuItem={{ restaurantId: parseInt(id) }}
            />
          }
        />
      </div>

      {Object.keys(groupedItems).map((type) => (
        <div key={type} className="menu-section">
          <h3>{type}</h3>
          <div className="menu-items-grid">
            {groupedItems[type].map((item) => (
              <MenuItemCard key={item.id} menuItem={item} />
            ))}
          </div>
        </div>
      ))}

      <ShoppingCartModal />
    </div>
  );
}
