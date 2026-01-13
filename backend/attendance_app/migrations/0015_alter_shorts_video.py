import attendance_app.models
import cloudinary_storage.storage
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('attendance_app', '0014_supportmessage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='shorts',
            name='video',
            field=models.FileField(storage=cloudinary_storage.storage.VideoMediaCloudinaryStorage(), upload_to='shorts/', validators=[attendance_app.models.validate_file_type]),
        ),
    ]
