#!/bin/bash

# Creates a virtual environment for Django

cd django_backend

python3 -m venv myenv
source myenv/bin/activate
pip install -r requirements.txt


# cd to django_backend
# Activate the virtual environment: source myenv/bin/activate
# Start server: python manage.py runserver

