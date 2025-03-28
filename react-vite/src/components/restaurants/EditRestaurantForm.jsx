import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./RestaurantsPage.css";


export default function EditRestaurantForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", address: "", cuisine: "", image_url: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/restaurants`)
      .then((res) => res.json())
      .then((data) => {
        const r = data.find((r) => r.id === parseInt(id));
        if (r) setForm({ name: r.name, address: r.address, cuisine: r.cuisine, image_url: r.image_url || "" });
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/restaurants/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      navigate(`/restaurants/${id}`);
    } else {
      const data = await res.json();
      setError(data.error || "Failed to update restaurant.");
    }
  };

  return (
    <form className="restaurant-form" onSubmit={handleSubmit}>
      <h2>Edit Restaurant</h2>
      {error && <p className="form-error">{error}</p>}
      <input
        type="text"
        value={form.name}
        placeholder="Restaurant Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        type="text"
        value={form.address}
        placeholder="Address"
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        required
      />
      <input
        type="text"
        value={form.cuisine}
        placeholder="Cuisine (optional)"
        onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
      />
      <input
        type="text"
        value={form.image_url}
        placeholder="Image URL (optional)"
        onChange={(e) => setForm({ ...form, image_url: e.target.value })}
      />
      <button type="submit">Update</button>
    </form>
  );
}
