# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('widgetRest', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='user_pass',
            field=models.CharField(default='unUsuario', max_length=50),
            preserve_default=False,
        ),
    ]
