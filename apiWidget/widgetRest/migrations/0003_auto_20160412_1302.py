# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-04-12 16:02
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('widgetRest', '0002_widget_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='widget',
            name='widget_icon',
            field=models.CharField(max_length=200, unique=True),
        ),
    ]