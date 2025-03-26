// src/components/restaurants/RestaurantsPage.jsx

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
    const res = await fetch(`/api/restaurants/${id}`, { method: "DELETE" });
    if (res.ok) {
      setRestaurants((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // Add mock data to restaurants
  const addMockInfo = (restaurant) => {
    const ratings = [4.7, 4.8, 4.9, 5.0];
    const fees = ["$1.99", "$2.99", "Free", "$3.49"];
    const times = ["15–25 min", "20–30 min", "25–35 min"];
    const tags = [
      ["Pizza", "Italian"],
      ["Healthy", "Vegan"],
      ["Sushi", "Japanese"],
      ["Burgers", "Fast Food"],
    ];
    const rand = Math.floor(Math.random() * 4);
    return {
      ...restaurant,
      rating: ratings[rand],
      fee: fees[rand],
      time: times[rand % 3],
      tags: tags[rand],
    };
  };

  const featuredRestaurants = restaurants.slice(0, 6).map(addMockInfo);
  const allRestaurants = restaurants.map(addMockInfo);

  return (
    <div className="restaurants-page">
      <div className="restaurants-header">
        <h2>Featured on Uber Eats</h2>
        <Link to="/restaurants/new">
          <button className="create-restaurant-btn">Create New Restaurant</button>
        </Link>
      </div>

      {/* Horizontal scroll row */}
      <div className="restaurant-scroll-row">
        {featuredRestaurants.map((r) => (
          <div key={r.id} className="restaurant-card">
            <img src={r.image_url || "/restaurant-placeholder.jpg"} alt={r.name} />
            <div className="restaurant-info">
              <h3>{r.name}</h3>
              <p className="rating">⭐ {r.rating}</p>
              <p>{r.address}</p>
              <p className="tags">{r.tags?.join(", ")}</p>
              <p>{r.time} • {r.fee}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grid section */}
      <h2 className="section-title">All Restaurants</h2>
      <div className="restaurant-grid">
        {allRestaurants.map((r) => (
          <div key={r.id} className="restaurant-card">
            <img src={r.image_url || "/restaurant-placeholder.jpg"} alt={r.name} />
            <div className="restaurant-info">
              <h3>{r.name}</h3>
              <p className="rating">⭐ {r.rating}</p>
              <p>{r.address}</p>
              <p className="tags">{r.tags?.join(", ")}</p>
              <p>{r.time} • {r.fee}</p>
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
