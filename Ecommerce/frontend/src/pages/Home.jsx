import { useEffect, useState } from "react";
import API from "../api";
import { useCart } from "../context/CartContext";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const { addToCart } = useCart();

  useEffect(() => {
    API.get("/products").then((res) => setProducts(res.data));
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filtered = products.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <section className="hero">
        <h1>Shop Smart, Live Better</h1>
        <p>Latest products at the best prices</p>
        <div className="search">
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <div className="container">
        <h2 className="page-title">Our Products</h2>

        <div className="chips">
          {categories.map((c) => (
            <button
              key={c}
              className={`chip ${category === c ? "active" : ""}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="empty">Koi product nahi mila</p>
        ) : (
          <div className="grid">
            {filtered.map((p) => (
              <div key={p._id} className="card">
                <div className="card-img">
                  {p.image && <img src={p.image} alt={p.name} />}
                </div>
                <div className="info">
                  {p.category && <span className="cat">{p.category}</span>}
                  <h3>{p.name}</h3>
                  <p className="price">₹{p.price}</p>
                  <p className="muted">
                    {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                  </p>
                  <button disabled={p.stock === 0} onClick={() => addToCart(p)}>
                    {p.stock === 0 ? "Out of stock" : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}