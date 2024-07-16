# syntax=docker/dockerfile:1

#https://hub.docker.com/_/python
FROM python:3-alpine
WORKDIR /usr/src/app
COPY . .
RUN <<EOF
cd django_backend
python3 -m pip install --user virtualenv
python3 -m pip install virtualenv myenv
source myenv/bin/activate
pip install -r requirements.txt
EOF
WORKDIR /usr/src/app/django_backend
RUN chmod +x ./runserver.sh
EXPOSE 8043
CMD ["sh", "./runserver.sh"]
