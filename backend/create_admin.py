import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_backend.settings')
django.setup()

from django.contrib.auth.models import User

def create_admin():
    username = os.getenv('ADMIN_USERNAME')
    password = os.getenv('ADMIN_PASSWORD')
    email = os.getenv('ADMIN_EMAIL', 'admin@example.com')

    if not username or not password:
        print("ADMIN_USERNAME or ADMIN_PASSWORD not set in environment variables. Skipping.")
        return

    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username, email, password)
        print(f"✅ Superuser '{username}' created successfully.")
    else:
        # If user exists, update the password just in case
        user = User.objects.get(username=username)
        user.set_password(password)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        print(f"🔄 Superuser '{username}' already exists. Password updated.")

if __name__ == "__main__":
    create_admin()
