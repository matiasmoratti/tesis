# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('widgetRest', '0003_remove_user_user_pass'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='user_pass',
            field=models.CharField(max_length=50, default='123'),
            preserve_default=False,
        ),
    ]
