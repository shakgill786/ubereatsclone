import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMenuItemsByRestaurantId } from "../../../store/menuItems";
import MenuItemCard from "../MenuItemCard";
import "./MenuItemsPage.css";

export default function MenuItemsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const menuItems = useSelector(state => state.menuItems.restaurantMenuItems);

  useEffect(() => {
    dispatch(getMenuItemsByRestaurantId(id));
  }, [dispatch, id]);

  return (
    <div className="menu-items-page-container">
      <h2>Menu Items</h2>
      <div className="menu-items-grid">
        {menuItems.length ? (
          menuItems.map((item) => (
            <MenuItemCard key={item.id} menuItem={item} />
          ))
        ) : (
          <p>No menu items found.</p>
        )}
      </div>
    </div>
  );
}
