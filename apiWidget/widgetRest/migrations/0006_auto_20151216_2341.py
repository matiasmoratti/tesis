# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('widgetRest', '0005_activeuser'),
    ]

    operations = [
        migrations.RenameField(
            model_name='activeuser',
            old_name='activeUsers_domain',
            new_name='activeUser_domain',
        ),
        migrations.RenameField(
            model_name='activeuser',
            old_name='activeUsers_user',
            new_name='activeUser_user',
        ),
    ]
