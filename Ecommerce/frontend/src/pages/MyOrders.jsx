import { useEffect, useState } from "react";
import API from "../api";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/orders/my")
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container"><p className="empty">Loading...</p></div>;

  return (
    <div className="container">
      <h2 className="page-title">My Orders</h2>
      {orders.length === 0 && <p className="empty">Abhi koi order nahi hai</p>}
      {orders.map((o) => (
        <div key={o._id} className="order-card">
          <div className="order-head">
            <span className="muted">
              {new Date(o.createdAt).toLocaleDateString("en-IN")} • #{o._id.slice(-6)}
            </span>
            <span className={`status ${o.status}`}>{o.status}</span>
          </div>
          {o.items.map((i, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
              <span>{i.name} × {i.qty}</span>
              <span>₹{i.price * i.qty}</span>
            </div>
          ))}
          <hr style={{ margin: "10px 0", border: "none", borderTop: "1px solid #eee" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <b>Total</b>
            <b>₹{o.totalPrice}</b>
          </div>
          {o.address && <p className="muted" style={{ marginTop: 8 }}>Deliver to: {o.address}</p>}
        </div>
      ))}
    </div>
  );
}