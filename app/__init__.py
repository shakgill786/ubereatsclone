import os
from flask import Flask, request, redirect
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import generate_csrf
from flask_login import LoginManager
from .models import db, User
from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .api.restaurant_routes import restaurant_routes
from .api.favorite_routes import favorite_routes
from .api.menu_item_routes import menu_item_routes
from .api.image_routes import image_routes
from .api.cart_routes import cart_routes
from .seeds import seed_commands, auto_seed_if_empty
from .config import Config

app = Flask(__name__, static_folder='../react-vite/dist', static_url_path='/')

login = LoginManager(app)
login.login_view = 'auth.unauthorized'

@login.user_loader
def load_user(id):
    return User.query.get(int(id))

# Register CLI
app.cli.add_command(seed_commands)

# ✅ Config and DB setup
app.config.from_object(Config)
db.init_app(app)

# ✅ Register Flask-Migrate properly
migrate = Migrate(app, db)

with app.app_context():
     from flask_migrate import upgrade
     upgrade()

# CORS
CORS(app, supports_credentials=True)

# Blueprints
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(restaurant_routes, url_prefix='/api/restaurants')
app.register_blueprint(favorite_routes, url_prefix='/api/favorites')
app.register_blueprint(menu_item_routes, url_prefix='/api/menu-items')
app.register_blueprint(image_routes, url_prefix='/api/images')
app.register_blueprint(cart_routes, url_prefix='/api/cart_item')

@app.before_request
def https_redirect():
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            return redirect(url, code=301)

@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=os.environ.get('FLASK_ENV') == 'production',
        samesite='Strict' if os.environ.get('FLASK_ENV') == 'production' else None,
        httponly=False
    )
    return response

@app.route("/api/csrf/restore")
def restore_csrf():
    return {"message": "CSRF cookie set"}

@app.route("/api/docs")
def api_help():
    acceptable_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    return {
        rule.rule: [
            [method for method in rule.methods if method in acceptable_methods],
            app.view_functions[rule.endpoint].__doc__
        ]
        for rule in app.url_map.iter_rules() if rule.endpoint != 'static'
    }

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    if path == 'favicon.ico':
        return app.send_from_directory('public', 'favicon.ico')
    return app.send_static_file('index.html')

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')
