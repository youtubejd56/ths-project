from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    admin_forgot_password, AttendanceViewSet, ShortsViewSet,
    ai_chat, attendance_summary, StudentMarkViewSet,
    clear_division_marks, clear_all_marks,
    EventPostViewSet, AdmissionView, AdmissionListView,
    save_attendance, get_attendance,
    AdminLoginView, AdminDashboardView,
    send_otp, verify_otp, reset_password
)

# -------------------- Routers --------------------
router = DefaultRouter()
router.register(r"posts", EventPostViewSet, basename="event-post")
router.register(r"marks", StudentMarkViewSet, basename="student-mark")
router.register(r"attendance", AttendanceViewSet, basename="attendance")
router.register(r"shorts", ShortsViewSet, basename="shorts")

# -------------------- URL Patterns --------------------
urlpatterns = [
    # Admin
    # Admin
    path("admin-login/", AdminLoginView.as_view(), name="admin-login"),
    path("admin-dashboard/", AdminDashboardView.as_view(), name="admin-dashboard"),
    path("admin-forgot-password/", admin_forgot_password, name="admin-forgot-password"),

    # OTP & Reset (for admin password reset)
    path("admin-send-otp/", send_otp, name="admin-send-otp"),
    path("admin-verify-otp/", verify_otp, name="admin-verify-otp"),
    path("admin-reset-password/", reset_password, name="admin-reset-password"),

    # Attendance
    path("attendance/save/", save_attendance, name="save-attendance"),
    path("attendance/get/", get_attendance, name="get-attendance"),
    path("attendance/summary/", attendance_summary, name="attendance-summary"),

    # Student Marks
    path("marks/clear_division/<str:division>/", clear_division_marks, name="clear-division-marks"),
    path("marks/clear_all/", clear_all_marks, name="clear-all-marks"),

    # Admission
    path("admission/", AdmissionView.as_view(), name="admission-submit"),
    path("admissiondata/", AdmissionListView.as_view(), name="admission-list"),

    # AI Chat
    path("ai-chat/", ai_chat, name="ai-chat"),

    # Include routers for viewsets
    path("", include(router.urls)),
]
