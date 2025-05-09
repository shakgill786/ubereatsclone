import { useNavigate } from "react-router-dom";
import { useShoppingCart } from "../../context/ShoppingCart";
import "./CartPage.css";

export default function CartPage() {
  const { cart, setCart } = useShoppingCart();
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + (item.menu_item?.price || 0) * item.quantity, 0);

  // ✅ NEW: Clear Cart (separate logic)
  const clearCart = async () => {
    try {
      const res = await fetch("/api/cart/clear", {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setCart([]);
      } else {
        alert(data.error || "Failed to clear cart.");
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  // ✅ NEW: Checkout
  const checkoutCart = async () => {
    try {
      const res = await fetch("/api/cart/checkout", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setCart([]);
        alert("Checkout successful!");
        navigate("/dashboard");
      } else {
        alert(data.error || "Checkout failed.");
      }
    } catch (err) {
      console.error("Error during checkout:", err);
    }
  };

  return (
    <div className="cart-page-container">
      {cart.length > 0 && (
        <div className="back-to-top">
          <button
            className="back-to-main-button"
            onClick={() =>
              navigate(`/restaurants/${cart[0].menu_item?.restaurantId}/menu`)
            }
          >
            ← Back to Restaurant
          </button>
        </div>
      )}

      <div className="cart-box">
        <h2 className="cart-title">Your Cart</h2>

        {cart.length === 0 ? (
          <p className="empty-cart-text">Your cart is empty.</p>
        ) : (
          <>
            <ul className="cart-items-list">
              {cart.map((item, i) => (
                <li key={i} className="cart-item">
                  <span>{item.quantity} × {item.menu_item?.name}</span>
                  <span>${(item.menu_item?.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="cart-summary">
              <div className="cart-total">Total: ${total.toFixed(2)}</div>
              <div className="cart-actions">
                <button className="checkout-button" onClick={checkoutCart}>
                  Checkout
                </button>
                <button className="clear-cart-btn" onClick={clearCart}>
                  Clear Cart
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
