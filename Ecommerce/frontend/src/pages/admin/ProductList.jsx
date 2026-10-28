import { useEffect, useState } from "react";
import API from "../../api";

const empty = { name: "", description: "", price: "", category: "", stock: "", image: "" };

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const load = () => API.get("/products").then((res) => setProducts(res.data));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const body = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editId) await API.put(`/products/${editId}`, body);
      else await API.post("/products", body);
      setForm(empty);
      setEditId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Save nahi hua");
    }
  };

  const edit = (p) => {
    setEditId(p._id);
    setForm({
      name: p.name, description: p.description || "", price: p.price,
      category: p.category || "", stock: p.stock, image: p.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Pakka delete karna hai?")) return;
    await API.delete(`/products/${id}`);
    load();
  };

  const cancelEdit = () => { setEditId(null); setForm(empty); };

  return (
    <div className="container">
      <h2 className="page-title">{editId ? "Edit Product" : "Add Product"}</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={submit} className="admin-form">
        <input placeholder="Name *" value={form.name} required
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input type="number" placeholder="Price *" value={form.price} required min="0"
          onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input type="number" placeholder="Stock" value={form.stock} min="0"
          onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        <input placeholder="Category" value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input placeholder="Image URL" value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <input placeholder="Description" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="actions">
          <button type="submit">{editId ? "Update Product" : "Add Product"}</button>
          {editId && <button type="button" className="btn-secondary" onClick={cancelEdit}>Cancel</button>}
        </div>
      </form>

      <h2 className="page-title">All Products ({products.length})</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Action</th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  {p.image && <img src={p.image} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }} />}
                </td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>₹{p.price}</td>
                <td>{p.stock}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button onClick={() => edit(p)}>Edit</button>{" "}
                  <button className="btn-danger" onClick={() => remove(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}