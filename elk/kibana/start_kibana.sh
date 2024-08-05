#!/bin/sh

set -e

CERT_DIR="/usr/share/kibana/config/certs"
CERT_FILE="$CERT_DIR/kibana.crt"
KEY_FILE="$CERT_DIR/kibana.key"

mkdir -p "$CERT_DIR"

echo "$SSL_CERT" > "$CERT_FILE"
echo "$SSL_KEY" > "$KEY_FILE"
echo "$ELASTIC_PASSWORD" > /usr/share/kibana/config/kibana-pw.txt

chown -R kibana:kibana "$CERT_DIR"
chmod 600 "$KEY_FILE"
chmod 644 "$CERT_FILE"

while ! curl -k -u "$ELASTIC_USERNAME":"$ELASTIC_PASSWORD" https://elasticsearch:9200 | grep "You Know, for Search"; do
  echo "Waiting for Elasticsearch to start..."
  sleep 5
done

curl -k -u "$ELASTIC_USERNAME":"$ELASTIC_PASSWORD" -X POST "https://elasticsearch:9200/_security/user/kibana_user" -H "Content-Type: application/json" -d '{"password" : "'"$KIBANA_PASSWORD"'", "roles" : [ "kibana_system" ]}'
curl -k -u "$ELASTIC_USERNAME":"$ELASTIC_PASSWORD" -X POST "https://elasticsearch:9200/_security/user/$NEW_USER_KIBANA" -H "Content-Type: application/json" -d '{"password" : "'"$KIBANA_PASSWORD"'", "roles" : [ "superuser" ]}'

kibana --config /usr/share/kibana/config/kibana.yml
#tail -f /dev/null
