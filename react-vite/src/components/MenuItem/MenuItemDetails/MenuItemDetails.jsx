import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getOneMenuItemThunk } from '../../../redux/menuItems';
import { getOneRestaurantThunk } from '../../../redux/restaurant';
import { useShoppingCart } from '../../../context/ShoppingCart';
import './MenuItemDetails.css';

export default function MenuItemDetails() {
  const dispatch = useDispatch();
  const { menuItemId } = useParams();
  const { cart, setCart } = useShoppingCart();
  const [isLoaded, setIsLoaded] = useState(false);

  const sessionUser = useSelector(state => state.session.user);
  const menuItem = useSelector(state => state.menuItems.singleMenuItem || {});
  const restaurant = useSelector(state => state.restaurant.singleRestaurant || {});

  const itemInCart = (menuItem) => !!cart.find(item => item.menu_item?.id === menuItem.id);
  const restaurantInCart = (menuItem) => cart.length > 0 && menuItem.restaurantId !== cart[0].menu_item?.restaurantId;

  const fetchCart = async () => {
    const res = await fetch("/api/cart", { credentials: "include" });
    const data = await res.json();
    setCart(data.cart_items);
  };

  const addToCart = async () => {
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ menu_item_id: menuItem.id }),
      });
      fetchCart();
    } catch (err) {
      console.error("Error adding item:", err);
    }
  };

  const removeFromCart = async () => {
    const itemToDelete = cart.find(item => item.menu_item?.id === menuItem.id);
    if (itemToDelete) {
      await fetch(`/api/cart/${itemToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
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
            {menuItem.imageUrl && (
              <img className="menu-item-details-img" src={menuItem.imageUrl} alt={menuItem.name} />
            )}
          </div>

          <div className="menu-item-details-info">
            <div className="menu-item-details-name">{menuItem.name}</div>
            <div className="menu-item-details-price">${menuItem.price}</div>
            <div className="menu-item-details-description">{menuItem.description}</div>

            {restaurantInCart(menuItem) ? (
              <>
                <p>Orders can only be placed from one restaurant at a time.</p>
                <p>Please complete or clear your current cart to order from another restaurant.</p>
              </>
            ) : (
              sessionUser && !itemInCart(menuItem) && (
                <button className="menu-item-details-add-or-remove-button" onClick={addToCart}>
                  Add to order
                </button>
              )
            )}

            {sessionUser && itemInCart(menuItem) && (
              <button className="menu-item-details-add-or-remove-button" onClick={removeFromCart}>
                Remove from order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
