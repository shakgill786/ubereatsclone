import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getOneMenuItemThunk } from '../../store/menuItems';
import './MenuItemDetails.css';
import { getOneRestaurantThunk } from '../../store/restaurant';
import { useShoppingCart } from '../../context/ShoppingCart';

export default function MenuItemDetails() {
  const sessionUser = useSelector(state => state.session.user);
  const { menuItemId } = useParams();
  const _menuItemIdAsNum = parseInt(menuItemId);
  const { cart, setCart } = useShoppingCart();
  const [isLoaded, setIsLoaded] = useState(false);

  const menuItem = useSelector(state => state.menuItems.singleMenuItem || {});
  const restaurant = useSelector(state => state.restaurant.singleRestaurant || {});

  let _hideAddButton = sessionUser === null;
  let _hideRemoveButton = sessionUser === null;

  const itemInCart = (menuItem) => !!cart.find((thing) => thing.id === menuItem.id);

  const restaurantInCart = (menuItem) => {
    if (!cart.length) return false;
    return menuItem.restaurantId !== cart[0].restaurantId;
  };

  const addToCart = (item) => setCart([...cart, item]);

  const removeFromCart = (menuItem) => {
    const updatedCart = cart.filter(item => item.id !== menuItem.id);
    setCart(updatedCart);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOneMenuItemThunk(menuItemId))
      .then(res => dispatch(getOneRestaurantThunk(res.restaurantId)))
      .then(() => setIsLoaded(true));
  }, [dispatch, menuItemId]);

  return (
    <>
      {isLoaded && (
        <div className="menu-item-details-outermost-box">
          <div className="menu-item-details-centering-box">
            <div className="back-restaurants-mi">
              <Link to={`/restaurants/${menuItem.restaurantId}/menu`}>
                ⬅ Back to {restaurant.name || ''}
              </Link>
            </div>

            <div className="menu-item-details-card">
              <div>
                {menuItem.imageUrl && (
                  <img
                    className="menu-item-details-img"
                    src={menuItem.imageUrl}
                    alt={menuItem.name}
                  />
                )}
              </div>

              <div className="menu-item-details-info">
                <div className="menu-item-details-name">{menuItem.name}</div>
                <div className="menu-item-details-price">${menuItem.price}</div>
                <div className="menu-item-details-description">{menuItem.description}</div>

                {restaurantInCart(menuItem) ? (
                  <>
                    <p>Orders can only be placed from one restaurant at a time.</p>
                    <p>
                      Please complete current order, or empty cart to order from another
                      restaurant.
                    </p>
                  </>
                ) : (
                  <button
                    className="menu-item-details-add-or-remove-button"
                    onClick={() => addToCart(menuItem)}
                  >
                    Add to order
                  </button>
                )}

                {itemInCart(menuItem) && (
                  <button
                    className="menu-item-details-add-or-remove-button"
                    onClick={() => removeFromCart(menuItem)}
                  >
                    Remove from order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
