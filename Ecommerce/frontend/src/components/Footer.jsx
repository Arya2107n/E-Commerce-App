import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <h4>MyShop</h4>
          <p>Aapki apni online dukaan. Quality products, best prices.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/my-orders">My Orders</Link>
        </div>
        <div>
          <h4>Contact</h4>
          <p>support@myshop.com</p>
          <p>India</p>
        </div>
      </div>
      <div className="copy">© {new Date().getFullYear()} MyShop. All rights reserved.</div>
    </footer>
  );
}