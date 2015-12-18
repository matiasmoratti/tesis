# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('widgetRest', '0002_user_user_pass'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='user_pass',
        ),
    ]
