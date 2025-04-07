# backend/api/image_routes.py

from flask import Blueprint, request, jsonify
import uuid
import os

image_routes = Blueprint('images', __name__)

# Dummy image upload route - replace with actual S3 logic if using AWS
@image_routes.route('/upload', methods=['POST'])
def upload_image():
    if "image" not in request.files:
        return jsonify({"errors": ["Image file is required."]}), 400

    image = request.files["image"]

    # Simulate a successful upload
    filename = f"{uuid.uuid4().hex}_{image.filename}"
    # In a real app, upload the image to S3 or store locally and return URL
    image_url = f"/mock_uploads/{filename}"  # Change to actual path or S3 link

    return jsonify({"url": image_url})
