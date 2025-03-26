from flask import Blueprint, request
from app.models import User, db
from app.forms import LoginForm, SignUpForm
from flask_login import current_user, login_user, logout_user
import traceback

auth_routes = Blueprint('auth', __name__)

@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict()
    return {'errors': {'message': 'Unauthorized'}}, 401

@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    try:
        form = LoginForm()

        # Get CSRF token
        csrf_token = request.cookies.get("csrf_token")
        form['csrf_token'].data = csrf_token

        print("🔐 Login request received")
        print("📥 Request JSON:", request.json)
        print("🍪 Cookies:", request.cookies)
        print("🔒 CSRF token:", csrf_token)

        if form.validate_on_submit():
            user = User.query.filter(User.email == form.data['email']).first()
            if not user:
                print("❌ No user found.")
                return {"errors": ["Invalid credentials."]}, 401

            login_user(user)
            print("✅ Login successful for:", user.email)
            return user.to_dict()

        print("❌ Login form validation failed:", form.errors)
        return {"errors": form.errors}, 401

    except Exception as e:
        print("🔥 Exception in login route:", str(e))
        traceback.print_exc()
        return {"errors": ["Server error. Please try again."]}, 500


@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}

@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    try:
        form = SignUpForm()
        csrf_token = request.cookies.get("csrf_token")
        form['csrf_token'].data = csrf_token

        print("📝 Signup request received")
        print("📥 Request JSON:", request.json)
        print("🔒 CSRF token:", csrf_token)

        if form.validate_on_submit():
            user = User(
                username=form.data['username'],
                email=form.data['email'],
                password=form.data['password']
            )
            db.session.add(user)
            db.session.commit()
            login_user(user)
            print("✅ Signup and login successful for:", user.email)
            return user.to_dict()

        print("❌ Signup form validation failed:", form.errors)
        return {"errors": form.errors}, 401

    except Exception as e:
        print("🔥 Exception during signup:", str(e))
        traceback.print_exc()
        return {"errors": ["Server error. Please try again."]}, 500


@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': {'message': 'Unauthorized'}}, 401
