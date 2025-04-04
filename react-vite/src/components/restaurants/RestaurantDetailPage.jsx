import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./RestaurantDetailPage.css";

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    fetch(`/api/restaurants`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((r) => r.id === parseInt(id));
        if (found) setRestaurant(found);
      });
  }, [id]);

  if (!restaurant) return <p>Loading...</p>;

  return (
    <div className="restaurant-detail">
      <img src={restaurant.image_url || "/restaurant-placeholder.jpg"} alt={restaurant.name} />
      <h2>{restaurant.name}</h2>
      <p><strong>Address:</strong> {restaurant.address}</p>
      <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>

      {/* ✨ View Menu Button */}
      <Link to={`/restaurants/${restaurant.id}/menu`}>
        <button className="view-menu-btn">View Menu</button>
      </Link>

      <Link to={`/restaurants/${restaurant.id}/edit`}>
        <button className="edit-btn">Edit</button>
      </Link>
    </div>
  );
}
