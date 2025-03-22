import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function EditRestaurantForm() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [errors, setErrors] = useState([]);

  // Fetch the current restaurant details
  useEffect(() => {
    fetch(`/api/restaurants`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((r) => r.id === parseInt(id));
        if (found) setRestaurant(found);
      });
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const res = await fetch(`/api/restaurants/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(restaurant),
    });

    if (res.ok) {
      alert("Restaurant updated!");
    } else {
      const errorData = await res.json();
      setErrors([errorData.message || "Failed to update"]);
    }
  };

  if (!restaurant) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Restaurant</h2>

      {/* Show errors if any */}
      {errors.length > 0 && (
        <ul style={{ color: "red" }}>
          {errors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}

      <label>
        Name:
        <input
          type="text"
          value={restaurant.name}
          onChange={(e) => setRestaurant({ ...restaurant, name: e.target.value })}
          required
        />
      </label>
      <br />

      <label>
        Address:
        <input
          type="text"
          value={restaurant.address}
          onChange={(e) => setRestaurant({ ...restaurant, address: e.target.value })}
          required
        />
      </label>
      <br />

      <label>
        Cuisine:
        <input
          type="text"
          value={restaurant.cuisine}
          onChange={(e) => setRestaurant({ ...restaurant, cuisine: e.target.value })}
        />
      </label>
      <br />

      <button type="submit">Update</button>
    </form>
  );
}
