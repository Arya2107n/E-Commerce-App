import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/register", form);
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Kuch galat hua");
    }
  };

  return (
    <form onSubmit={submit} className="form-box">
      <h2>Create Account</h2>
      {error && <p className="error">{error}</p>}
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password (min 6 characters)"
        value={form.password}
        minLength={6}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />
      <button type="submit" className="btn-block">Register</button>
      <p>Pehle se account hai? <Link to="/login">Login</Link></p>
    </form>
  );
}