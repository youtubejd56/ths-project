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
from django.utils import timezone
from datetime import date, timedelta
import calendar
import random
from cloudinary.uploader import destroy

from .models import Attendance, StudentMark, EventPost, Admission, Shorts, SupportMessage, EmailOTP
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

    def get_permissions(self):
        # Anyone can view posts
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]

        # Anyone can create/upload posts
        if self.action == 'create':
            return [AllowAny()]

        # Only authenticated users can delete (we'll check admin in destroy)
        if self.action == 'destroy':
            return [IsAuthenticated()]

        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        now = timezone.now()
        current_month = now.month
        current_year = now.year
        current_day = now.day

        # Filter posts from THIS calendar month only
        posts_this_month = EventPost.objects.filter(
            created_at__month=current_month,
            created_at__year=current_year
        )

        # Monthly limit (16 posts per calendar month)
        if posts_this_month.count() >= 16:
            return Response({"detail": "Maximum 16 posts allowed for this month!"}, status=status.HTTP_400_BAD_REQUEST)

        # Determine week index (0, 1, 2, or 3)
        week_index = (current_day - 1) // 7
        if week_index > 3:
            week_index = 3
        
        # Define the day range for the current week
        week_start_day = week_index * 7 + 1
        if week_index < 3:
            week_end_day = (week_index + 1) * 7
        else:
            # Week 4 goes to the end of the month
            _, last_day = calendar.monthrange(current_year, current_month)
            week_end_day = last_day

        # Count posts in this specific week of the current month
        posts_this_week = posts_this_month.filter(
            created_at__day__range=(week_start_day, week_end_day)
        ).count()

        if posts_this_week >= 4:
            return Response({"detail": f"Weekly limit reached (Week {week_index + 1})! Please upload next week."}, status=status.HTTP_400_BAD_REQUEST)

        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        # Only admin can delete
        if not request.user.is_staff:
            return Response({"detail": "Only admin can delete posts"}, status=status.HTTP_403_FORBIDDEN)

        instance = self.get_object()

        # Optional: delete the file from Cloudinary
        if instance.file and hasattr(instance.file, 'name'):
            try:
                public_id = instance.file.name.rsplit('/', 1)[-1].split('.')[0]
                destroy(public_id)
            except:
                pass  # ignore if Cloudinary deletion fails

        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)




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
        
        if not phone or not name or not address:
            return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Check if this mobile number already exists in the database
        if Admission.objects.filter(phone_num=phone).exists():
            return Response({'error': 'This mobile number has already been used for an admission.'}, status=status.HTTP_400_BAD_REQUEST)

        admission = Admission(phone_num=phone, student_name=name, address=address)
        admission.save()
        return Response({'message': 'Admission submitted successfully!'}, status=status.HTTP_201_CREATED)


class AdmissionListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if not request.user.is_staff:
            return Response({"error": "Admin access required"}, status=403)
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

    from django.db import transaction
    if not date_val or not division or not students:
        return Response({"error": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        with transaction.atomic():
            for student in students:
                Attendance.objects.create(
                    date=date_val,
                    division=division,
                    student_name=student["student_name"],
                    status=student["status"],
                    roll_number=student.get("roll_number"),
                    year=student.get("year")
                )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
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

    frontend_url = os.getenv("FRONTEND_URL", "https://ths-frontend-p8v4.onrender.com")
    reset_link = f"{frontend_url}/reset-password/{user.id}/"
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
    queryset = Shorts.objects.all().order_by('-created_at')
    serializer_class = ShortsSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'create']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response({"error": "Only admins can delete videos"}, status=403)
        return super().destroy(request, *args, **kwargs)

    


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

    if not getattr(settings, 'GEMINI_API_KEY', None):
        return JsonResponse(
            {"reply": "Server error: Gemini API key not configured."},
            status=500
        )

    try:
        import google.generativeai as genai
        
        # Configure Gemini
        genai.configure(api_key=settings.GEMINI_API_KEY)
        
        # DYNAMIC MODEL SELECTION: Find what models this key actually has access to
        print("DEBUG: Fetching available Gemini models...")
        working_model_name = 'gemini-1.5-flash' # Default fallback
        try:
            available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
            print(f"DEBUG: Found models: {available_models}")
            
            # Prioritize standard models
            if 'models/gemini-1.5-flash' in available_models:
                working_model_name = 'models/gemini-1.5-flash'
            elif 'models/gemini-1.5-flash-latest' in available_models:
                working_model_name = 'models/gemini-1.5-flash-latest'
            elif 'models/gemini-pro' in available_models:
                working_model_name = 'models/gemini-pro'
            elif available_models:
                # If preferred models aren't there, take the first one that supports generation
                working_model_name = available_models[0]
        except Exception as e:
            print(f"DEBUG: Failed to list models: {e}")

        print(f"DEBUG: Final choice: {working_model_name}")
        model = genai.GenerativeModel(working_model_name)
        
        # Simpler generation call (more robust than chat session for debugging)
        response = model.generate_content(
            contents=user_msg,
            generation_config=genai.types.GenerationConfig(
                temperature=0.3,
            )
        )
        
        if response.text:
            reply = response.text
        else:
            reply = "I received an empty response. Could you try rephrasing your question?"

        # Save to database
        SupportMessage.objects.create(user_query=user_msg, bot_response=reply)

        return JsonResponse({"reply": reply})

    except Exception as e:
        import traceback
        error_type = type(e).__name__
        error_msg = str(e)
        print(f"GEMINI CRITICAL ERROR: {error_type} - {error_msg}")
        traceback.print_exc()
        
        return JsonResponse(
            {
                "reply": f"I am currently in 'Offline Mode'. (System Error: {error_type}: {error_msg})"
            },
            status=200
        )
    

# -------------------- Send OTP --------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp(request):
    email = request.data.get("email")
    if not email:
        return JsonResponse({"error": "Email is required"}, status=400)
    try:
        user = User.objects.get(email=email, is_staff=True)
    except User.DoesNotExist:
        return JsonResponse({"error": "No admin account found with this email"}, status=404)
    otp = str(random.randint(100000, 999999))
    EmailOTP.objects.create(user=user, otp=otp, verified=False)
    try:
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

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

    try:
        otp_entry = EmailOTP.objects.filter(user=user, otp=otp, verified=False).latest("created_at")
    except EmailOTP.DoesNotExist:
        return JsonResponse({"error": "Invalid OTP"}, status=400)

    if otp_entry.is_expired():
        return JsonResponse({"error": "OTP expired"}, status=400)

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
        return JsonResponse({"error": "Email and password are required"}, status=400)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

    # Ensure OTP was verified
    if not EmailOTP.objects.filter(user=user, verified=True).exists():
        return JsonResponse({"error": "OTP not verified"}, status=400)

    user.set_password(new_password)
    user.save()

    # Optionally, delete used OTPs
    EmailOTP.objects.filter(user=user).delete()

    return JsonResponse({"message": "Password reset successful"})


    # -------------------- admin event posts Delete --------------------    

