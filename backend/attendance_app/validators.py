from django.core.exceptions import ValidationError
import os

def validate_file_extension(value):
    ext = os.path.splitext(value.name)[1].lower()
    allowed_extensions = ['.jpg', '.jpeg', '.png', '.pdf']
    if ext not in allowed_extensions:
        raise ValidationError(f"Unsupported file extension. Allowed: {', '.join(allowed_extensions)}")
