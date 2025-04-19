import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getOneMenuItemThunk } from '../../../redux/menuItems';
import { getOneRestaurantThunk } from '../../../redux/restaurant';
import { useShoppingCart } from '../../../context/ShoppingCart';
import OpenModalButton from '../../OpenModalButton/OpenModalButton';
import MenuItemFormUpdate from '../MenuItemFormUpdate/MenuItemFormUpdate';
import MenuItemDeleteModal from '../MenuItemDeleteModal/MenuItemDeleteModal';
import './MenuItemDetails.css';

export default function MenuItemDetails() {
  const dispatch = useDispatch();
  const { menuItemId } = useParams();
  const { cart, setCart } = useShoppingCart();
  const [isLoaded, setIsLoaded] = useState(false);
  const [localQuantity, setLocalQuantity] = useState(1);

  const sessionUser = useSelector(state => state.session.user);
  const menuItem = useSelector(state => state.menuItems.singleMenuItem || {});
  const restaurant = useSelector(state => state.restaurant.singleRestaurant || {});
  const itemInCart = cart.find(item => item.menu_item?.id === menuItem.id);
  const restaurantInCart = cart.length > 0 && menuItem.restaurantId !== cart[0].menu_item?.restaurantId;

  const fetchCart = async () => {
    const res = await fetch("/api/cart", { credentials: "include" });
    const data = await res.json();
    setCart(data.cart_items);
  };

  const handleCartUpdate = async () => {
    if (itemInCart) {
      await fetch(`/api/cart/${itemInCart.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity: localQuantity })
      });
    } else {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ menu_item_id: menuItem.id, quantity: localQuantity })
      });
    }
    fetchCart();
  };

  const removeFromCart = async () => {
    if (itemInCart) {
      await fetch(`/api/cart/${itemInCart.id}`, {
        method: "DELETE",
        credentials: "include"
      });
      fetchCart();
    }
  };

  useEffect(() => {
    dispatch(getOneMenuItemThunk(menuItemId))
      .then(res => dispatch(getOneRestaurantThunk(res.restaurantId)))
      .then(() => setIsLoaded(true));
  }, [dispatch, menuItemId]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="menu-item-details-outermost-box">
      <div className="menu-item-details-centering-box">
        <div className="back-restaurants-mi">
          <Link to={`/restaurants/${menuItem.restaurantId}/menu`}>
            ⬅ Back to {restaurant.name || 'Restaurant'}
          </Link>
        </div>

        <div className="menu-item-details-card">
          <div>
            {menuItem.image_url && (
              <img className="menu-item-details-img" src={menuItem.image_url} alt={menuItem.name} />
            )}
          </div>

          <div className="menu-item-details-info">
            <div className="menu-item-details-name">{menuItem.name}</div>
            <div className="menu-item-details-price">${menuItem.price}</div>
            <div className="menu-item-details-description">{menuItem.description}</div>

            {restaurantInCart ? (
              <>
                <p>Orders can only be placed from one restaurant at a time.</p>
                <p>Please complete or clear your current cart to order from another restaurant.</p>
              </>
            ) : sessionUser && (
              <div className="menu-item-details-quantity-controls">
                <label>Quantity: </label>
                <input
                  type="number"
                  min="1"
                  value={localQuantity}
                  onChange={(e) => setLocalQuantity(Number(e.target.value))}
                />

                <div style={{ marginTop: "10px" }}>
                  <button
                    className="menu-item-details-add-or-remove-button"
                    onClick={handleCartUpdate}
                  >
                    {itemInCart ? "Update Cart" : "Add to Cart"}
                  </button>

                  {itemInCart && (
                    <button
                      className="menu-item-details-add-or-remove-button"
                      style={{ backgroundColor: "#c0392b", borderColor: "#c0392b", marginLeft: "10px" }}
                      onClick={removeFromCart}
                    >
                      Remove from Cart
                    </button>
                  )}
                </div>
              </div>
            )}

            {sessionUser?.id === menuItem.user_id && (
              <div className="menu-item-owner-actions" style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                <OpenModalButton
                  buttonText="Edit"
                  modalComponent={<MenuItemFormUpdate menuItem={menuItem} />}
                  className="menu-item-edit-btn"
                />
                <OpenModalButton
                  buttonText="Delete"
                  modalComponent={<MenuItemDeleteModal menuItemId={menuItem.id} />}
                  className="menu-item-delete-btn"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
