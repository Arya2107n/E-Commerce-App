import { useEffect, useState } from "react";
import API from "../../api";

export default function OrderList() {
  const [orders, setOrders] = useState([]);

  const load = () => API.get("/orders").then((res) => setOrders(res.data));
  useEffect(() => { load(); }, []);

  const changeStatus = async (id, status) => {
    await API.put(`/orders/${id}`, { status });
    load();
  };

  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div className="container">
      <h2 className="page-title">All Orders</h2>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <div className="order-card" style={{ margin: 0, flex: 1, minWidth: 160 }}>
          <p className="muted">Total Orders</p>
          <h2>{orders.length}</h2>
        </div>
        <div className="order-card" style={{ margin: 0, flex: 1, minWidth: 160 }}>
          <p className="muted">Revenue</p>
          <h2>₹{revenue}</h2>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Customer</th><th>Items</th><th>Total</th><th>Address</th><th>Status</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{o.user?.name}<br /><span className="muted">{o.user?.email}</span></td>
                <td>{o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}</td>
                <td>₹{o.totalPrice}</td>
                <td>{o.address}</td>
                <td>
                  <select value={o.status} onChange={(e) => changeStatus(o._id, e.target.value)}>
                    <option>pending</option>
                    <option>shipped</option>
                    <option>delivered</option>
                    <option>cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}