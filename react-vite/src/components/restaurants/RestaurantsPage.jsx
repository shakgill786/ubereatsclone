import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RestaurantsPage.css";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/restaurants")
      .then((res) => res.json())
      .then((data) => setRestaurants(data));
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleAddToCart = (id) => {
    setCart((prev) => [...prev, id]);
    const button = document.getElementById(`add-to-cart-${id}`);
    if (button) {
      button.classList.add("bounce");
      setTimeout(() => button.classList.remove("bounce"), 600);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this restaurant?")) return;
    const res = await fetch(`/api/restaurants/${id}`, { method: "DELETE" });
    if (res.ok) setRestaurants((prev) => prev.filter((r) => r.id !== id));
  };

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

  const featured = restaurants.slice(0, 6).map(addMockInfo);
  const all = restaurants.map(addMockInfo);

  const renderCard = (r) => (
    <div key={r.id} className="restaurant-card" onClick={() => navigate(`/restaurants/${r.id}`)}>
      <img src={r.image_url || "/restaurant-placeholder.jpg"} alt={r.name} />
      <div className="restaurant-info">
        <h3>{r.name}</h3>
        <p className="rating">⭐ {r.rating}</p>
        <p>{r.address}</p>
        <p className="tags">{r.tags?.join(", ")}</p>
        <p>{r.time} • {r.fee}</p>
        <div className="card-buttons" onClick={(e) => e.stopPropagation()}>
          <span
            className={`favorite-icon ${favorites.includes(r.id) ? "filled" : ""}`}
            onClick={() => toggleFavorite(r.id)}
          >
            ♥
          </span>
          <button
            id={`add-to-cart-${r.id}`}
            className="add-to-cart-btn"
            onClick={() => handleAddToCart(r.id)}
          >
            Add to Cart
          </button>
        </div>
        <div className="restaurant-actions">
          <Link to={`/restaurants/${r.id}/edit`} onClick={(e) => e.stopPropagation()}>
            <button className="edit-btn">Edit</button>
          </Link>
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(r.id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="restaurants-page">
      <div className="restaurants-header">
        <h2>Featured on Uber Eats</h2>
        <Link to="/restaurants/new">
          <button className="create-restaurant-btn">Create New Restaurant</button>
        </Link>
      </div>

      <div className="restaurant-scroll-row">
        {featured.map(renderCard)}
      </div>

      <h2 className="section-title">All Restaurants</h2>
      <div className="restaurant-grid">
        {all.map(renderCard)}
      </div>
    </div>
  );
}
