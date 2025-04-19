import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMenuItemsForRestaurantThunk } from "../../../redux/menuItems";
import { useShoppingCart } from "../../../context/ShoppingCart";
import MenuItemForm from "../MenuItemForm/MenuItemForm";
import MenuItemFormUpdate from "../MenuItemFormUpdate/MenuItemFormUpdate";
import OpenModalButton from "../../OpenModalButton/OpenModalButton";
import ShoppingCartModal from "../../ShoppingCart/ShoppingCart";
import MenuItemDeleteModal from "../MenuItemDeleteModal/MenuItemDeleteModal";
import "./MenuItemsPage.css";

export default function MenuItemsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { setCart } = useShoppingCart();
  const menuItems = useSelector((state) => state.menuItems.allMenuItems || []);
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(getMenuItemsForRestaurantThunk(id));
  }, [dispatch, id]);

  const handleAddToCart = async (itemId) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ menu_item_id: itemId }),
      });
      if (res.ok) {
        const updated = await fetch("/api/cart", { credentials: "include" });
        const data = await updated.json();
        setCart(data.cart_items);
      }
    } catch (err) {
      console.error("❌ Add to cart failed:", err);
    }
  };

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
              <div className="menu-item-card-wrapper" key={item.id}>
                <Link to={`/menu-items/${item.id}`} className="menu-item-link">
                  <div className="menu-item-card">
                    <img src={item.image_url} alt={item.name} className="menu-item-img" />
                    <div className="menu-item-name">{item.name}</div>
                    <div className="menu-item-price">${item.price}</div>
                  </div>
                </Link>

                <div className="menu-item-actions">
                  <button className="add-to-cart-btn" onClick={() => handleAddToCart(item.id)}>
                    Add to Cart
                  </button>

                  {sessionUser?.id === item.user_id && (
                    <div className="menu-item-owner-actions" onClick={(e) => e.stopPropagation()}>
                      <OpenModalButton
                        buttonText="Edit"
                        modalComponent={<MenuItemFormUpdate menuItem={item} />}
                        className="menu-item-edit-btn"
                      />
                      <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<MenuItemDeleteModal menuItemId={item.id} />}
                        className="menu-item-delete-btn"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <ShoppingCartModal />
    </div>
  );
}
