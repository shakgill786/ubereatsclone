import { useEffect, useState } from "react";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch("/api/restaurants")
      .then(res => res.json())
      .then(data => setRestaurants(data));
  }, []);

  return (
    <div>
      <h2>All Restaurants</h2>
      <ul>
        {restaurants.map((r) => (
          <li key={r.id}>
            <strong>{r.name}</strong> — {r.address} ({r.cuisine})
          </li>
        ))}
      </ul>
    </div>
  );
}
