from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from attendance_app.models import EmailOTP
import random


# -------------------- Send OTP --------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp(request):
    email = request.data.get("email")
    
    if not email:
        return JsonResponse({"error": "Email is required"}, status=400)
    
    # Check if user exists and is an admin
    try:
        user = User.objects.get(email=email, is_staff=True)
    except User.DoesNotExist:
        return JsonResponse({"error": "No admin account found with this email"}, status=404)
    
    # Generate 6-digit OTP
    otp = str(random.randint(100000, 999999))
    
    # Save OTP to database
    EmailOTP.objects.create(user=user, otp=otp, verified=False)
    
    # Send OTP via email
    try:
        from django.utils import timezone
        current_time = timezone.now().strftime("%H:%M:%S")
        send_mail(
            subject=f"Password Reset OTP - {current_time}",
            message=f"Your OTP for password reset is: {otp}\n\nThis OTP will expire in 10 minutes.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        return JsonResponse({"message": "OTP sent to your email"}, status=200)
    except Exception as e:
        print(f"Email error: {e}")
        return JsonResponse({"error": "Failed to send email. Please try again."}, status=500)


# -------------------- Verify OTP --------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    email = request.data.get("email")
    otp = request.data.get("otp")
    
    if not email or not otp:
        return JsonResponse({"error": "Email and OTP are required"}, status=400)
    
    # Find user
    try:
        user = User.objects.get(email=email, is_staff=True)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    
    # Find OTP entry
    try:
        otp_entry = EmailOTP.objects.filter(
            user=user, 
            otp=otp, 
            verified=False
        ).latest("created_at")
    except EmailOTP.DoesNotExist:
        return JsonResponse({"error": "Invalid OTP"}, status=400)
    
    # Check if OTP is expired
    if otp_entry.is_expired():
        return JsonResponse({"error": "OTP has expired. Please request a new one."}, status=400)
    
    # Mark OTP as verified
    otp_entry.verified = True
    otp_entry.save()
    
    return JsonResponse({"message": "OTP verified successfully"}, status=200)


# -------------------- Reset Password --------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    email = request.data.get("email")
    new_password = request.data.get("password")
    
    if not email or not new_password:
        return JsonResponse({"error": "Email and password are required"}, status=400)
    
    # Find user
    try:
        user = User.objects.get(email=email, is_staff=True)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    
    # Ensure OTP was verified
    if not EmailOTP.objects.filter(user=user, verified=True).exists():
        return JsonResponse({"error": "Please verify OTP first"}, status=400)
    
    # Reset password
    user.set_password(new_password)
    user.save()
    
    # Delete all OTPs for this user
    EmailOTP.objects.filter(user=user).delete()
    
    return JsonResponse({"message": "Password reset successful"}, status=200)
