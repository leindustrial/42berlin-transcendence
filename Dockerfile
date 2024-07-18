FROM python:3-alpine
WORKDIR /usr/src/app
COPY . .
WORKDIR /usr/src/app/django_backend
RUN python3 -m pip install --user virtualenv
RUN python3 -m virtualenv myenv
RUN /bin/sh -c "source myenv/bin/activate && pip install -r requirements.txt"
WORKDIR /usr/src/app/django_backend
RUN chmod +x ./runserver.sh
EXPOSE 8043
CMD ["sh", "./runserver.sh"]