from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User

def validate_file_type(value):
    valid_mime_types = ['image/jpeg', 'image/png', 'application/pdf']
    if value.content_type not in valid_mime_types:
        raise ValidationError('Unsupported file type. Allowed: JPG, PNG, PDF.')

# -------------------- Event Post --------------------
class EventPost(models.Model):
    file = models.FileField(
        upload_to='event_files/',
        validators=[validate_file_type],
        blank=True,
        null=True
    )
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.description[:30]

# -------------------- Admission --------------------
class Admission(models.Model):
    phone_num = models.CharField(max_length=15)
    student_name = models.CharField(max_length=100)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.student_name

# -------------------- Student Marks --------------------
class StudentMark(models.Model):
    EXAM_CHOICES = [
        ("First Term", "First Term"),
        ("Second Term", "Second Term"),
        ("Annual Exam", "Annual Exam"),
    ]

    division = models.CharField(max_length=10)
    roll_no = models.CharField(max_length=10)
    student_name = models.CharField(max_length=100)
    year = models.IntegerField(default=2025)
    exam = models.CharField(max_length=20, choices=EXAM_CHOICES, default="First Term")

    maths = models.IntegerField(null=True, blank=True)
    physics = models.IntegerField(null=True, blank=True)
    chemistry = models.IntegerField(null=True, blank=True)
    english = models.IntegerField(null=True, blank=True)
    malayalam = models.IntegerField(null=True, blank=True)
    ss = models.IntegerField(null=True, blank=True)
    ed = models.IntegerField(null=True, blank=True)
    workshop = models.IntegerField(null=True, blank=True)
    eye = models.IntegerField(null=True, blank=True)
    ge = models.IntegerField(null=True, blank=True)
    tradeTheory = models.IntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("division", "roll_no", "year", "exam")

    def __str__(self):
        return f"{self.student_name} ({self.division}, {self.exam}, {self.year})"

# -------------------- Attendance --------------------
class Attendance(models.Model):
    date = models.DateField()
    division = models.CharField(max_length=10)
    year = models.CharField(max_length=10)
    roll_number = models.PositiveIntegerField()
    student_name = models.CharField(max_length=100)
    status = models.CharField(max_length=10, choices=[("Present", "Present"), ("Absent", "Absent")])

    class Meta:
        ordering = ["year", "division", "roll_number"]

    def __str__(self):
        return f"{self.year} - {self.division} - {self.roll_number} - {self.student_name}"

# -------------------- Shorts --------------------
class Shorts(models.Model):
    title = models.CharField(max_length=255)
    caption = models.TextField()
    video = models.FileField(upload_to='shorts/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

# -------------------- Student --------------------
class Student(models.Model):
    student_name = models.CharField(max_length=100)
    roll_number = models.IntegerField()
    division = models.CharField(max_length=10)
    year = models.CharField(max_length=10)
    phone_num = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.student_name} ({self.year} - {self.division})"
    


# -------------------- email--------------------
class EmailOTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def is_expired(self):
        from django.utils import timezone
        from datetime import timedelta
        return timezone.now() > self.created_at + timedelta(minutes=10)