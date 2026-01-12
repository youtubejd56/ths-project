from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.conf import settings
from django.http import JsonResponse
from django.db.models import Count, Q
from datetime import date, timedelta

import calendar
import random
from django.core.mail import send_mail
from .models import EmailOTP

from .models import Attendance, StudentMark, EventPost, Admission, Shorts, SupportMessage
from .serializers import (
    AttendanceSerializer,
    StudentMarkSerializer,
    EventPostSerializer,
    AdmissionSerializer,
    ShortsSerializer,
)

# -------------------- Event Post --------------------
class EventPostViewSet(viewsets.ModelViewSet):
    queryset = EventPost.objects.all().order_by('-created_at')
    serializer_class = EventPostSerializer


# -------------------- Admin --------------------
class AdminLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user is not None and user.is_staff:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response(
            {'detail': 'Invalid credentials or not an admin'},
            status=status.HTTP_401_UNAUTHORIZED
        )


class AdminDashboardView(APIView):
    def get(self, request):
        if not request.user.is_staff:
            return Response({"detail": "Not an admin"}, status=403)
        return Response({
            "username": request.user.username,
            "email": request.user.email
        })


# -------------------- Admission --------------------
class AdmissionView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        phone = request.data.get('phone_num')
        name = request.data.get('student_name')
        address = request.data.get('address')
        if phone and name and address:
            admission = Admission(phone_num=phone, student_name=name, address=address)
            admission.save()
            return Response({'message': 'Admission submitted successfully!'}, status=status.HTTP_201_CREATED)
        return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)


class AdmissionListView(APIView):
    def get(self, request):
        admissions = Admission.objects.all().order_by('-id')
        serializer = AdmissionSerializer(admissions, many=True)
        return Response(serializer.data)


# -------------------- Student Marks --------------------
class StudentMarkViewSet(viewsets.ModelViewSet):
    serializer_class = StudentMarkSerializer

    def get_queryset(self):
        division = self.request.query_params.get("division")
        year = self.request.query_params.get("year")
        exam = self.request.query_params.get("exam")

        qs = StudentMark.objects.all().order_by("roll_no")
        if division:
            qs = qs.filter(division=division)
        if year:
            qs = qs.filter(year=year)
        if exam:
            qs = qs.filter(exam=exam)
        return qs


# -------------------- Clear Marks --------------------
@api_view(['DELETE'])
def clear_division_marks(request, division):
    valid_divisions = ["10A", "10B", "9A", "9B", "8A", "8B"]
    if division not in valid_divisions:
        return Response({"error": "Invalid division"}, status=status.HTTP_400_BAD_REQUEST)

    year = request.GET.get("year")
    exam = request.GET.get("exam")

    filters = {"division": division}
    if year:
        filters["year"] = year
    if exam:
        filters["exam"] = exam

    deleted_count, _ = StudentMark.objects.filter(**filters).delete()
    return Response(
        {"message": f"{deleted_count} marks cleared for division {division}"
                    + (f", {exam}" if exam else "")
                    + (f", {year}" if year else "")},
        status=status.HTTP_200_OK
    )


@api_view(['DELETE'])
def clear_all_marks(request):
    deleted_count, _ = StudentMark.objects.all().delete()
    return Response({"message": f"All marks cleared ({deleted_count} records deleted)"}, status=status.HTTP_200_OK)


# -------------------- Attendance --------------------
@api_view(["POST"])
def save_attendance(request):
    date_val = request.data.get("date")
    division = request.data.get("division")
    students = request.data.get("students", [])

    if not date_val or not division or not students:
        return Response({"error": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)

    for student in students:
        Attendance.objects.create(
            date=date_val,
            division=division,
            student_name=student["student_name"],
            status=student["status"],
            roll_number=student.get("roll_number"),
            year=student.get("year")
        )
    return Response({"message": f"Attendance saved for {division} on {date_val}"}, status=status.HTTP_201_CREATED)


@api_view(["GET"])
def get_attendance(request):
    division = request.query_params.get("division")
    date_val = request.query_params.get("date")

    qs = Attendance.objects.all()
    if division:
        qs = qs.filter(division=division)
    if date_val:
        qs = qs.filter(date=date_val)

    serializer = AttendanceSerializer(qs, many=True)
    return Response(serializer.data, status=200)


@api_view(['GET'])
def attendance_summary(request):
    """
    Returns weekly and monthly attendance summary for charts.
    Supports optional division filter (?division=10A).
    """
    division = request.query_params.get("division")

    today = date.today()
    week_start = today - timedelta(days=today.weekday())
    monthly_start = today.replace(day=1)

    weekly_qs = Attendance.objects.filter(date__gte=week_start)
    monthly_qs = Attendance.objects.filter(date__gte=monthly_start)

    if division:
        weekly_qs = weekly_qs.filter(division=division)
        monthly_qs = monthly_qs.filter(division=division)

    weekly = weekly_qs.values("date").annotate(
        Present=Count("id", filter=Q(status="Present")),
        Absent=Count("id", filter=Q(status="Absent"))
    ).order_by("date")

    monthly = monthly_qs.values("date").annotate(
        Present=Count("id", filter=Q(status="Present")),
        Absent=Count("id", filter=Q(status="Absent"))
    ).order_by("date")

    weekly_data = [{"day": d["date"].strftime("%a"), "Present": d["Present"], "Absent": d["Absent"]} for d in weekly]
    monthly_data = [{"month": calendar.month_abbr[d["date"].month], "Present": d["Present"], "Absent": d["Absent"]} for d in monthly]

    return Response({"weekly": weekly_data, "monthly": monthly_data})


# -------------------- Forgot Password --------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def admin_forgot_password(request):
    email = request.data.get("email")
    if not email:
        return Response({"error": "Email is required"}, status=400)
    try:
        user = User.objects.get(email=email, is_staff=True)
    except User.DoesNotExist:
        return Response({"error": "No admin found with this email"}, status=404)

    reset_link = f"http://localhost:3000/reset-password/{user.id}/"
    send_mail(
        "Admin Password Reset",
        f"Click the link to reset your password: {reset_link}",
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=True
    )
    return Response({"message": "Password reset email sent"}, status=200)


# -------------------- Shorts Video --------------------
class ShortsViewSet(viewsets.ModelViewSet):
    queryset = Shorts.objects.all()
    serializer_class = ShortsSerializer


# -------------------- Attendance ViewSet --------------------
class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all().order_by("year", "division", "roll_number")
    serializer_class = AttendanceSerializer


# -------------------- AI Chat --------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def ai_chat(request):
    user_msg = (request.data.get("message") or "").strip()

    if not user_msg:
        return JsonResponse(
            {"reply": "Please type a message."},
            status=400
        )

    if not settings.OPENAI_API_KEY:
        return JsonResponse(
            {"reply": "Server error: OpenAI API key not configured."},
            status=500
        )

    try:
        from openai import OpenAI

        client = OpenAI(api_key=settings.OPENAI_API_KEY)

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful school support assistant."
                },
                {
                    "role": "user",
                    "content": user_msg
                }
            ],
            temperature=0.3,
        )

        reply = response.choices[0].message.content

        # Save to database
        SupportMessage.objects.create(user_query=user_msg, bot_response=reply)

        return JsonResponse({"reply": reply})

    except Exception as e:
        print("OPENAI ERROR:", e)  # 🔥 REAL error visible
        return JsonResponse(
            {"reply": "AI service unavailable. Check server logs."},
            status=503
        )
    

# -------------------- Send OTP --------------------




# -------------------- Verify OTP --------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    email = request.data.get("email")
    otp = request.data.get("otp")

    if not email or not otp:
        return JsonResponse({"message": "Email and OTP are required"}, status=400)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({"message": "User not found"}, status=404)

    try:
        otp_entry = EmailOTP.objects.filter(user=user, otp=otp, verified=False).latest("created_at")
    except EmailOTP.DoesNotExist:
        return JsonResponse({"message": "Invalid OTP"}, status=400)

    if otp_entry.is_expired():
        return JsonResponse({"message": "OTP expired"}, status=400)

    otp_entry.verified = True
    otp_entry.save()

    return JsonResponse({"message": "OTP verified"})


# -------------------- Reset Password --------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    email = request.data.get("email")
    new_password = request.data.get("password")

    if not email or not new_password:
        return JsonResponse({"message": "Email and password are required"}, status=400)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({"message": "User not found"}, status=404)

    # Ensure OTP was verified
    if not EmailOTP.objects.filter(user=user, verified=True).exists():
        return JsonResponse({"message": "OTP not verified"}, status=400)

    user.set_password(new_password)
    user.save()

    # Optionally, delete used OTPs
    EmailOTP.objects.filter(user=user).delete()

    return JsonResponse({"message": "Password reset successful"})