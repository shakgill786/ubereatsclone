from flask import Blueprint, request
from ..models import db, MenuItem
from ..forms.menu_item_form import MenuItemForm
from flask_login import login_required
import datetime

menu_item_routes = Blueprint('menu_items', __name__)

@menu_item_routes.route('/restaurant/<int:restaurant_id>/menu-items')
def get_menu_items_for_restaurant(restaurant_id):
    menu_items = MenuItem.query.filter_by(restaurant_id=restaurant_id).all()
    return {"menuItems": [item.to_dict() for item in menu_items]}

@menu_item_routes.route('/<int:id>', methods=['GET'])
def get_menu_item(id):
    menu_item = MenuItem.query.get(id)
    return menu_item.to_dict()

@menu_item_routes.route('/<int:id>/update', methods=['PUT'])
@login_required
def update_menu_item(id):
    form = MenuItemForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        item = MenuItem.query.get(id)
        item.name = form.data['name']
        item.type = form.data['type']
        item.price = form.data['price']
        item.description = form.data['description']
        item.image_url = form.data['image_url']
        item.updated_at = datetime.datetime.now()
        db.session.commit()
        return item.to_dict()
    return {"errors": form.errors}, 400

@menu_item_routes.route('/<int:id>/delete', methods=['DELETE'])
@login_required
def delete_menu_item(id):
    item = MenuItem.query.get(id)
    db.session.delete(item)
    db.session.commit()
    return {"message": "Successfully deleted menu item", "id": id}

@menu_item_routes.route('/create/<int:restaurant_id>', methods=['POST'])
@login_required
def create_menu_item(restaurant_id):
    form = MenuItemForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        item = MenuItem(
            name=form.data['name'],
            type=form.data['type'],
            price=form.data['price'],
            description=form.data['description'],
            image_url=form.data['image_url'],
            restaurant_id=restaurant_id,
            created_at=datetime.datetime.now(),
            updated_at=datetime.datetime.now()
        )
        db.session.add(item)
        db.session.commit()
        return item.to_dict(), 201
    return {"errors": form.errors}, 400
