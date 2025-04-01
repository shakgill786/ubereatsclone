import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCookie } from "../../utils/csrf";
import "./DashboardPage.css";

export default function DashboardPage() {
  const [owned, setOwned] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Fetch user-owned restaurants
    fetch("/api/restaurants/my-restaurants", { credentials: "include" })
      .then((res) => res.json())
      .then(setOwned)
      .catch((err) => {
        console.error("Failed to load owned restaurants:", err);
        setOwned([]);
      });

    // Fetch full favorite restaurants
    fetch("/api/favorites", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFavorites(data);
        } else {
          console.error("Unexpected favorites response:", data);
          setFavorites([]);
        }
      })
      .catch((err) => {
        console.error("Failed to load favorites:", err);
        setFavorites([]);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this restaurant?")) return;

    const res = await fetch(`/api/restaurants/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": getCookie("csrf_token"),
      },
    });

    if (res.ok) {
      setOwned((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const renderCard = (r, showActions = false) => (
    <div key={r.id} className="restaurant-card">
      <img src={r.image_url || "/restaurant-placeholder.jpg"} alt={r.name} />
      <div className="restaurant-info">
        <h3>{r.name}</h3>
        <p>{r.address}</p>
        <p className="tags">{r.cuisine}</p>
        {showActions && (
          <div className="restaurant-actions">
            <Link to={`/restaurants/${r.id}/edit`}>
              <button className="edit-btn">Edit</button>
            </Link>
            <button className="delete-btn" onClick={() => handleDelete(r.id)}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="dashboard-page">
      <h2>Your Restaurants</h2>
      {owned.length === 0 ? (
        <p>You haven’t added any restaurants yet.</p>
      ) : (
        <div className="restaurant-grid">{owned.map((r) => renderCard(r, true))}</div>
      )}

      <h2>Favorited Restaurants</h2>
      {favorites.length === 0 ? (
        <p>You haven’t favorited any restaurants yet.</p>
      ) : (
        <div className="restaurant-grid">{favorites.map((r) => renderCard(r))}</div>
      )}
    </div>
  );
}
