import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  const { cart, changeQty, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const placeOrder = async () => {
    if (!user) return navigate("/login");
    setLoading(true);
    setError("");
    try {
      await API.post("/orders", {
        items: cart.map((i) => ({ product: i._id, qty: i.qty })),
        address,
      });
      clearCart();
      navigate("/my-orders");
    } catch (err) {
      setError(err.response?.data?.message || "Order fail ho gaya");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0)
    return (
      <div className="container">
        <h2 className="page-title">Your Cart</h2>
        <p className="empty">
          Cart khali hai. <Link to="/" style={{ color: "var(--primary)" }}>Shopping shuru karo</Link>
        </p>
      </div>
    );

  return (
    <div className="container">
      <h2 className="page-title">Your Cart</h2>
      <div className="cart-layout">
        <div>
          {cart.map((i) => (
            <div key={i._id} className="cart-item">
              {i.image && <img src={i.image} alt={i.name} />}
              <div className="details">
                <h3>{i.name}</h3>
                <p className="price">₹{i.price}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                  <button className="btn-secondary" onClick={() => changeQty(i._id, -1)}>−</button>
                  <b>{i.qty}</b>
                  <button className="btn-secondary" onClick={() => changeQty(i._id, 1)}>+</button>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p><b>₹{i.price * i.qty}</b></p>
                <button className="btn-danger" style={{ marginTop: 8 }} onClick={() => removeFromCart(i._id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="summary">
          <h3>Order Summary</h3>
          <div className="total">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
          <textarea
            rows="3"
            placeholder="Delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <button className="btn-block" onClick={placeOrder} disabled={!address.trim() || loading}>
            {loading ? "Placing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}