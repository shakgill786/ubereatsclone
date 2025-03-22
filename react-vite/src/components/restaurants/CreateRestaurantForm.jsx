import { useState } from "react";

export default function CreateRestaurantForm() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const res = await fetch("/api/restaurants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, address, cuisine }),
    });

    if (res.ok) {
    await res.json();
      alert("Restaurant created!");
      // Optional: redirect or update state
    } else {
      const errorData = await res.json();
      setErrors([errorData.message || "Failed to create restaurant"]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a Restaurant</h2>

      {errors.length > 0 && (
        <ul>
          {errors.map((err, i) => <li key={i}>{err}</li>)}
        </ul>
      )}

      <label>
        Name:
        <input value={name} onChange={e => setName(e.target.value)} required />
      </label>

      <label>
        Address:
        <input value={address} onChange={e => setAddress(e.target.value)} required />
      </label>

      <label>
        Cuisine:
        <input value={cuisine} onChange={e => setCuisine(e.target.value)} />
      </label>

      <button type="submit">Create</button>
    </form>
  );
}
