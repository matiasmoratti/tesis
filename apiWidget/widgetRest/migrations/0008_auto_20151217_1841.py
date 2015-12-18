# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('widgetRest', '0007_auto_20151217_0020'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='comment_date',
            field=models.CharField(max_length=200),
        ),
    ]
