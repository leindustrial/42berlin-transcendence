cd ..
mkdir -p ssl
cd ssl
if [ -e certificate.crt ] && [ -e private.key ]; then
	echo "Certificate already exists"
else
	echo -e "$SSL_CERT" > certificate.crt
	echo -e "$SSL_KEY" > private.key
	chmod 600 private.key
	chmod 600 certificate.crt
fi
cd ../django_backend
cd pong_game
if grep -q $DJANGO_KEY settings.py; then
    echo "DJANGO_KEY is already in settings.py. Skipping..."
else
    echo >> settings.py
	echo $DJANGO_KEY >> settings.py
fi
cd ..
source myenv/bin/activate
python manage.py migrate
python manage.py createsuperuser --noinput
echo yes | python manage.py collectstatic
echo "Starting server"
daphne -e ssl:8043:privateKey=../ssl/private.key:certKey=../ssl/certificate.crt pong_game.asgi:application
#tail -f /dev/null
