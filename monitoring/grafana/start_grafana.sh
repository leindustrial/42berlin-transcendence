#!/bin/bash

set -e

mkdir -p /etc/grafana/certs

CERT_DIR="/etc/grafana/certs"
CERT_FILE="$CERT_DIR/certificate.crt"
KEY_FILE="$CERT_DIR/private.key"

echo "$SSL_CERT" > "$CERT_FILE"
echo "$SSL_KEY" > "$KEY_FILE"

chmod 644 /etc/grafana/certs/certificate.crt
chmod 644 /etc/grafana/certs/private.key

# sleep 10

# curl -X POST -H "Content-Type: application/json" -d '{
#   "name":"new_user",
#   "email":"new_user@example.com",
#   "login":"new_user",
#   "password":"arash12345"
# }' http://$GF_SECURITY_ADMIN_USER:$GF_SECURITY_ADMIN_PASSWORD@grafana:3000/api/admin/users

grafana-server --homepath=/usr/share/grafana --config=/etc/grafana/grafana.ini

