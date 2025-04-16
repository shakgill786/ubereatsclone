import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useShoppingCart } from "../../context/ShoppingCart";
import { getAllRestaurantsWithOneMenuItemThunk } from "../../redux/restaurant";
import "./ShoppingCart.css";

export default function ShoppingCart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ulRef = useRef();

  const { cart, setCart } = useShoppingCart();
  const [showMenu, setShowMenu] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [total, setTotal] = useState(0);

  const restaurants = useSelector((state) => state.restaurant.allRestaurants);

  useEffect(() => {
    let newTotal = 0;
    cart.forEach((item) => {
      newTotal += item.menu_item?.price || 0;
    });
    setTotal(newTotal);
  }, [cart]);

  useEffect(() => {
    dispatch(getAllRestaurantsWithOneMenuItemThunk());
    fetchCart();
  }, [dispatch]);

  const fetchCart = async () => {
    const res = await fetch("/api/cart", { credentials: "include" });
    const data = await res.json();
    setCart(data.cart_items);
    setIsLoaded(true);
  };

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

  const deleteItem = async (e, id) => {
    e.stopPropagation();
    try {
      await fetch(`/api/cart/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchCart();
    } catch (err) {
      console.error("Error deleting item from cart:", err);
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
                  {restaurants[cart[0].menu_item?.restaurantId]?.name || "Unknown Restaurant"}
                </div>
                <div className="cart-restaurant-address">
                  {restaurants[cart[0].menu_item?.restaurantId]?.streetAddress || ""}
                </div>
                <div className="cart-quantity">
                  {cart.length} {cart.length === 1 ? "item" : "items"}
                </div>
                <div className="cart-item-list">
                  {cart.map((item, idx) => (
                    <div className="item-entry" key={idx}>
                      <div>1 {item.menu_item?.name}</div>
                      <div className="item-entry-right">
                        <div>${item.menu_item?.price?.toFixed(2)}</div>
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
                    navigate(`/restaurants/${cart[0].menu_item?.restaurantId}/menu`);
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
                    {cart.length === 0 ? "Nothing in cart yet." : "Add items to start your cart"}
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
