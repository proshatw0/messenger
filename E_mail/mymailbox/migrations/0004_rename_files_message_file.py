# Generated by Django 4.2.7 on 2023-12-14 20:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mymailbox', '0003_message'),
    ]

    operations = [
        migrations.RenameField(
            model_name='message',
            old_name='files',
            new_name='file',
        ),
    ]
