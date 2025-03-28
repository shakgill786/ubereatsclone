import { useState } from "react";
import { getCookie } from "../../utils/csrf"; // adjust if needed

export default function CreateRestaurantForm() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess(false);

    const csrfToken = getCookie("csrf_token");

    const res = await fetch("/api/restaurants/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify({
        name,
        address,
        cuisine,
        image_url: imageUrl || null, // ✅ include image_url
      }),
    });

    if (res.ok) {
      setSuccess(true);
      setName("");
      setAddress("");
      setCuisine("");
      setImageUrl("");
    } else {
      const errorData = await res.json();
      setErrors([errorData.message || "Failed to create restaurant"]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="restaurant-form">
      <h2>Create a Restaurant</h2>

      {success && <p className="success-msg">✅ Restaurant created!</p>}
      {errors.length > 0 && (
        <ul className="error-list">
          {errors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}

      <label>
        Name:
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Restaurant name"
        />
      </label>

      <label>
        Address:
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          placeholder="123 Main St"
        />
      </label>

      <label>
        Cuisine:
        <input
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          placeholder="Italian, Sushi, etc."
        />
      </label>

      <label>
        Image URL:
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </label>

      <button type="submit">Create</button>
    </form>
  );
}
