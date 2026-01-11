# email_otp/urls.py

from django.urls import path
from .views import send_otp, verify_otp, reset_password

urlpatterns = [
    path('admin-send-otp/', send_otp, name='admin-send-otp'),
    path('admin-verify-otp/', verify_otp, name='admin-verify-otp'),
    path('admin-reset-password/', reset_password, name='admin-reset-password'),
]
