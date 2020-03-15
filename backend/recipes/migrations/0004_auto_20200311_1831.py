# Generated by Django 3.0.4 on 2020-03-11 18:31

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0003_auto_20200305_0019'),
    ]

    operations = [
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(blank=True, null=True)),
                ('title', models.CharField(max_length=100)),
                ('photo', models.FileField(upload_to='')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AlterField(
            model_name='comment',
            name='deleted_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='favorite',
            name='deleted_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='ingredient',
            name='deleted_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='instruction',
            name='deleted_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='deleted_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]