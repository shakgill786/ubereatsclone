import { useEffect, useState } from "react";
import { Link} from "react-router-dom";

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
      // Remove from local state after deletion
      setRestaurants((prev) => prev.filter((r) => r.id !== id));
    } else {
      const data = await res.json();
      alert(data.error || "Failed to delete restaurant.");
    }
  };

  return (
    <div>
      <h2>All Restaurants</h2>

      <Link to="/restaurants/new">
        <button>Create New Restaurant</button>
      </Link>

      <ul>
        {restaurants.map((r) => (
          <li key={r.id}>
            <strong>{r.name}</strong> — {r.address} ({r.cuisine}) &nbsp;

            {/* Edit button (if user is owner) */}
            <Link to={`/restaurants/${r.id}/edit`}>
              <button>Edit</button>
            </Link>

            {/* Delete button (if user is owner) */}
            <button onClick={() => handleDelete(r.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
