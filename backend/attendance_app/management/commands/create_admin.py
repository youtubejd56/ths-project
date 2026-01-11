from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

User = get_user_model()

class Command(BaseCommand):
    help = "Create or update an admin (superuser). Uses --username/--password or ADMIN_USERNAME/ADMIN_PASSWORD env vars."

    def add_arguments(self, parser):
        parser.add_argument('--username', type=str, help='Admin username')
        parser.add_argument('--password', type=str, help='Admin password')
        parser.add_argument('--email', type=str, help='Admin email (optional)')
        parser.add_argument('--force', action='store_true', help='Force update password even if user exists')

    def handle(self, *args, **options):
        username = options.get('username') or os.getenv('ADMIN_USERNAME')
        password = options.get('password') or os.getenv('ADMIN_PASSWORD')
        email = options.get('email') or os.getenv('ADMIN_EMAIL', '')

        if not username or not password:
            self.stderr.write(self.style.ERROR(
                "Username and password are required (pass --username/--password or set ADMIN_USERNAME/ADMIN_PASSWORD)"
            ))
            return

        user, created = User.objects.get_or_create(username=username, defaults={'email': email, 'is_superuser': True, 'is_staff': True})
        if created:
            user.set_password(password)
            user.is_superuser = True
            user.is_staff = True
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Superuser '{username}' created."))
        else:
            if options.get('force'):
                user.set_password(password)
                if email:
                    user.email = email
                user.is_superuser = True
                user.is_staff = True
                user.save()
                self.stdout.write(self.style.SUCCESS(f"Superuser '{username}' updated (password/email set)."))
            else:
                self.stdout.write(self.style.WARNING(
                    f"User '{username}' already exists. Use --force to update password/email and ensure superuser/staff flags."
                ))
