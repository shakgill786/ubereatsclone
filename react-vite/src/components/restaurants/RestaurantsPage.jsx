import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getCookie } from "../../utils/csrf";
import "./RestaurantsPage.css";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.session.user);

  // Scroll functions
  const scrollLeft = () => {
    const row = document.querySelector(".restaurant-scroll-row");
    if (row) row.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    const row = document.querySelector(".restaurant-scroll-row");
    if (row) row.scrollBy({ left: 300, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/restaurants");
      const data = await res.json();

      const ratings = [4.7, 4.8, 4.9, 5.0];
      const fees = ["$1.99", "$2.99", "Free", "$3.49"];
      const times = ["15–25 min", "20–30 min", "25–35 min"];
      const tags = [
        ["Pizza", "Italian"],
        ["Healthy", "Vegan"],
        ["Sushi", "Japanese"],
        ["Burgers", "Fast Food"],
      ];

      const enriched = data.map((restaurant) => {
        const rand = Math.floor(Math.random() * 4);
        return {
          ...restaurant,
          rating: restaurant.average_rating || 0,
          fee: fees[rand],
          time: times[rand % 3],
          tags: tags[rand],
        };
      });

      setRestaurants(enriched);
    };

    fetchData();

    fetch("/api/favorites", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setFavorites(data.map((fav) => fav.restaurant_id)));
  }, []);

  const toggleFavorite = async (id) => {
    const csrfToken = getCookie("csrf_token");

    const res = await fetch(`/api/favorites/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      credentials: "include",
    });

    if (res.ok) {
      const favRes = await fetch("/api/favorites", { credentials: "include" });
      if (favRes.ok) {
        const updated = await favRes.json();
        setFavorites(updated.map((r) => r.id));
      }
    }
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
    const res = await fetch(`/api/restaurants/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "X-CSRF-Token": getCookie("csrf_token"),
      },
    });
    if (res.ok) setRestaurants((prev) => prev.filter((r) => r.id !== id));
  };

  const renderCard = (r) => (
    <div key={r.id} className="restaurant-card" onClick={() => navigate(`/restaurants/${r.id}`)}>
      <img
          src={r.image_url && r.image_url.trim() !== "" ? r.image_url : "/restaurant-placeholder.jpg"}
          alt={r.name}
          className="restaurant-img"
      />
      <div className="restaurant-info">
        <h3>{r.name}</h3>
        <p className="rating">⭐ {r.rating}</p>
        <p>{r.address}</p>
        <p className="tags">{r.tags?.join(", ")}</p>
        <p>
          {r.time} • {r.fee}
        </p>

        <div className="card-buttons" onClick={(e) => e.stopPropagation()}>
          <span
            className={`favorite-icon ${favorites.includes(r.id) ? "filled" : ""}`}
            onClick={() => toggleFavorite(r.id)}
          >
            ♥
          </span>
          <button id={`add-to-cart-${r.id}`} className="add-to-cart-btn" onClick={() => handleAddToCart(r.id)}>
            Add to Cart
          </button>
        </div>

        {user && user.id === r.user_id && (
          <div className="restaurant-actions" onClick={(e) => e.stopPropagation()}>
            <Link to={`/restaurants/${r.id}/edit`}>
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
        )}
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

      {user && (
        <div className="dashboard-link-container">
          <Link to="/dashboard">
            <button className="dashboard-btn">Your Dashboard</button>
          </Link>
        </div>
      )}

      {/* Scroll Wrapper with Arrows */}
      <div className="scroll-wrapper">
        <button onClick={scrollLeft} className="scroll-button">
          ‹
        </button>

        <div className="restaurant-scroll-row">{restaurants.slice(0, 6).map(renderCard)}</div>

        <button onClick={scrollRight} className="scroll-button">
          ›
        </button>
      </div>

      <h2 className="section-title">All Restaurants</h2>
      <div className="restaurant-grid">{restaurants.map(renderCard)}</div>
    </div>
  );
}