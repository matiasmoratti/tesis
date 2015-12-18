# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('widgetRest', '0004_user_user_pass'),
    ]

    operations = [
        migrations.CreateModel(
            name='ActiveUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, primary_key=True, auto_created=True)),
                ('activeUsers_domain', models.CharField(max_length=200)),
                ('activeUsers_user', models.ForeignKey(to='widgetRest.User')),
            ],
        ),
    ]
