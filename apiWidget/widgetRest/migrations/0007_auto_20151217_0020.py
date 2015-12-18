# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('widgetRest', '0006_auto_20151216_2341'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activeuser',
            name='activeUser_user',
            field=models.CharField(max_length=200),
        ),
    ]
