import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // ✅ FIX: useNavigate for React Router v6
import { useShoppingCart } from "../../context/ShoppingCart";
import { getAllRestaurantsWithOneMenuItemThunk } from "../../redux/restaurant"; // ✅ FIXED import path
import "./ShoppingCart.css";

export default function ShoppingCart() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ FIXED useNavigate
  const ulRef = useRef();

  const { cart, setCart } = useShoppingCart();
  const [showMenu, setShowMenu] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [total, setTotal] = useState(0);

  const restaurants = useSelector((state) => state.restaurant.allRestaurants);

  useEffect(() => {
    let newTotal = 0;
    cart.forEach((item) => {
      newTotal += item.price;
    });
    setTotal(newTotal);
  }, [cart]);

  useEffect(() => {
    dispatch(getAllRestaurantsWithOneMenuItemThunk());
    setIsLoaded(true);
  }, [dispatch]);

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current) return;
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const toggleCart = () => setShowMenu(!showMenu);

  const handleCheckout = () => {
    navigate("/checkout");
    setShowMenu(false);
  };

  const deleteItem = (e, id) => {
    e.stopPropagation();
    const indexToDelete = cart.findIndex((item) => item.id === id);
    if (indexToDelete !== -1) {
      const newCart = [...cart];
      newCart.splice(indexToDelete, 1);
      setCart(newCart);
    }
  };

  const ulClassName = "cart-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className="shopping-cart" onClick={toggleCart}>
        <i className="fa-solid fa-cart-shopping"></i>
        <div>Cart</div>
      </button>
      <div>
        {showMenu ? (
          isLoaded && cart.length ? (
            <div className={ulClassName} ref={ulRef}>
              <div className="cart-contents">
                <button onClick={() => setShowMenu(false)} className="close-cart">
                  <i className="fa-solid fa-x"></i>
                </button>
                <div className="cart-restaurant">
                  {restaurants[cart[0].restaurantId]?.name}
                </div>
                <div className="cart-restaurant-address">
                  {restaurants[cart[0].restaurantId]?.streetAddress}
                </div>
                <div className="cart-quantity">
                  {cart.length} {cart.length === 1 ? "item" : "items"}
                </div>
                <div className="cart-item-list">
                  {cart.map((item, idx) => (
                    <div className="item-entry" key={idx}>
                      <div>1 {item.name}</div>
                      <div className="item-entry-right">
                        <div>${item.price.toFixed(2)}</div>
                        <div>
                          <button
                            className="item-entry-delete"
                            onClick={(e) => deleteItem(e, item.id)}
                          >
                            <i className="fa-regular fa-trash-can"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-total">
                  <div>Subtotal</div>
                  <div>${total.toFixed(2)}</div>
                </div>
              </div>
              <div className="cart-buttons">
                <button className="cart-checkout" onClick={handleCheckout}>
                  Go to checkout
                </button>
                <button
                  onClick={() => {
                    navigate(`/restaurants/${cart[0].restaurantId}/menu`);
                    setShowMenu(false);
                  }}
                >
                  Add items
                </button>
              </div>
            </div>
          ) : (
            <div className={ulClassName} ref={ulRef}>
              <div className="empty-cart-contents">
                <button onClick={() => setShowMenu(false)}>
                  <i className="fa-solid fa-x"></i>
                </button>
                <div className="empty-cart">
                  <div className="cart">
                    <img src="/emptycart.png" alt="empty cart" />
                  </div>
                  <div className="empty-card-header">
                    Add items to start your cart
                  </div>
                </div>
              </div>
            </div>
          )
        ) : null}
      </div>
    </>
  );
}
