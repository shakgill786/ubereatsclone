ForkYeah
A modern food delivery web app inspired by Uber Eats. Built with Flask, React, and PostgreSQL.

Database Schema
Entities:

Users (id, username, email, hashed_password, first_name, last_name)

Restaurants (id, user_id, name, address, cuisine, image_url)

MenuItems (id, restaurant_id, name, price, description, image_url)

CartItems (id, user_id, menu_item_id, quantity)

Favorites (id, user_id, restaurant_id)

Reviews (id, user_id, restaurant_id, content, stars)

Authentication
Get Current User
GET /api/auth/

Returns logged-in user or null

Log In
POST /api/auth/login

Requires: { email, password }

Errors:

json
Copy
Edit
{ "message": "The provided credentials were invalid" }
Sign Up
POST /api/auth/signup

Requires: { username, email, password, first_name, last_name }

Log Out
POST /api/auth/logout

Restaurants
Get All Restaurants
GET /api/restaurants

Public route

Create New Restaurant
POST /api/restaurants

Auth required

Body: { name, address, cuisine, image_url }

Edit Restaurant
PUT /api/restaurants/:id

Auth + owner required

Delete Restaurant
DELETE /api/restaurants/:id

Auth + owner required

Menu Items
Get Items by Restaurant
GET /api/restaurants/:id/menu-items

Create Menu Item
POST /api/menu-items/create/:restaurant_id

Auth + owner required

Edit Menu Item
PUT /api/menu-items/:id

Delete Menu Item
DELETE /api/menu-items/:id

Cart
View Cart
GET /api/cart

Add/Update Item
POST /api/cart

Update Quantity
POST /api/cart/:cart_item_id

Delete Item
DELETE /api/cart/:cart_item_id

Clear Cart
DELETE /api/cart/clear

Checkout
POST /api/cart/checkout

Favorites
Toggle Favorite
POST /api/favorites/:restaurant_id

Get All Favorites
GET /api/favorites

Reviews
Get Reviews for Restaurant
GET /api/restaurants/:id/reviews

Create Review
POST /api/reviews/:restaurant_id

Edit Review
PUT /api/reviews/:review_id

Delete Review
DELETE /api/reviews/:review_id