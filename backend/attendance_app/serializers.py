from rest_framework import serializers
from .models import EventPost, Admission, StudentMark, Attendance, Shorts

class EventPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventPost
        fields = '__all__'
        
class AdmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admission
        fields = '__all__'

class StudentMarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentMark
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'

class ShortsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shorts
        fields = ['id', 'title', 'caption', 'video', 'created_at']
