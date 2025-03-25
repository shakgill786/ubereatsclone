import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./RestaurantsPage.css";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch("/api/restaurants")
      .then((res) => res.json())
      .then((data) => setRestaurants(data));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this restaurant?")) return;

    const res = await fetch(`/api/restaurants/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setRestaurants((prev) => prev.filter((r) => r.id !== id));
    } else {
      const data = await res.json();
      alert(data.error || "Failed to delete restaurant.");
    }
  };

  return (
    <div className="restaurants-page">
      <div className="restaurants-header">
        <h2>Featured on Uber Eats</h2>
        <Link to="/restaurants/new">
          <button className="create-restaurant-btn">Create New Restaurant</button>
        </Link>
      </div>

      <div className="restaurant-scroll-row">
        {restaurants.map((r) => (
          <div key={r.id} className="restaurant-card">
            <img
              src="/restaurant-placeholder.jpg"
              alt={r.name}
              onError={(e) => {
                e.target.src = "/fallback-image.jpg";
              }}
            />
            <div className="restaurant-info">
              <h3>{r.name}</h3>
              <p>{r.address}</p>
              <p className="cuisine">{r.cuisine || "Cuisine"}</p>
              <div className="restaurant-actions">
                <Link to={`/restaurants/${r.id}/edit`}>
                  <button className="edit-btn">Edit</button>
                </Link>
                <button className="delete-btn" onClick={() => handleDelete(r.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
