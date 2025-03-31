// src/components/dashboard/DashboardPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export default function DashboardPage() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch("/api/restaurants/my-restaurants", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setRestaurants(data));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this restaurant?")) return;
    const res = await fetch(`/api/restaurants/${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) {
      setRestaurants((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="dashboard-page">
      <h2>Your Restaurants</h2>

      {restaurants.length === 0 && <p>You haven’t added any restaurants yet.</p>}

      <div className="restaurant-grid">
        {restaurants.map((r) => (
          <div key={r.id} className="restaurant-card">
            <img src={r.image_url || "/restaurant-placeholder.jpg"} alt={r.name} />
            <div className="restaurant-info">
              <h3>{r.name}</h3>
              <p>{r.address}</p>
              <p className="tags">{r.cuisine}</p>
              <div className="restaurant-actions">
                <Link to={`/restaurants/${r.id}/edit`}>
                  <button className="edit-btn">Edit</button>
                </Link>
                <button className="delete-btn" onClick={() => handleDelete(r.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
