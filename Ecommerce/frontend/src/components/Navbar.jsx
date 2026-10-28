import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  const close = () => setOpen(false);

  return (
    <nav className={`navbar ${open ? "open" : ""}`}>
      <Link to="/" className="logo" onClick={close}>
        My<span>Shop</span>
      </Link>
      <button className="menu-btn" onClick={() => setOpen(!open)}>
        {open ? "✕" : "☰"}
      </button>

      <div className="nav-links">
        <Link to="/" onClick={close}>Home</Link>
        {user?.role === "admin" ? (
          <>
            <Link to="/admin/products" onClick={close}>Products</Link>
            <Link to="/admin/orders" onClick={close}>Orders</Link>
          </>
        ) : (
          <>
            <Link to="/cart" onClick={close}>
              Cart <span className="badge">{count}</span>
            </Link>
            {user && <Link to="/my-orders" onClick={close}>My Orders</Link>}
          </>
        )}
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <span>Hi, {user.name}</span>
            <button onClick={() => { logout(); close(); navigate("/login"); }}>Logout</button>
          </>
        ) : (
          <Link to="/login" onClick={close}>Login</Link>
        )}
      </div>
    </nav>
  );
}