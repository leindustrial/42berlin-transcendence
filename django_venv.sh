#!/bin/bash

# Creates a virtual environment for Django

#mkdir django_backend
cd django_backend

# following command fails because we need to install python3.10-venv
# apt install python3.10-venv
# python3 -m venv myvenv
# using virtual environment instead

python3 -m pip install --user virtualenv
python3 -m virtualenv myenv
source myenv/bin/activate
pip install -r requirements.txt

# to leave myenv run
#deactivate
# to enter myenv run inside django_backend
# source myenv/bin/activate

# after installing new packages with pip install in myenv
# update requirements.txt for the team with run in myenv
# pip freeze > requirements.txt
# push the changed requirements to git
