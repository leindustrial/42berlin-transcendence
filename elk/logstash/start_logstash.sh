#!/bin/bash

set -e

CERT_DIR="/usr/share/logstash/config/certs"
CERT_FILE="$CERT_DIR/logstash.crt"
KEY_FILE="$CERT_DIR/logstash.key"

mkdir -p "$CERT_DIR"

echo "$SSL_CERT" > "$CERT_FILE"
echo "$SSL_KEY" > "$KEY_FILE"
echo "$ELASTIC_PASSWORD" > /usr/share/logstash/config/logstash-pw.txt

chown -R logstash:logstash "$CERT_DIR"
chmod 600 "$KEY_FILE"
chmod 644 "$CERT_FILE"

logstash -f /usr/share/logstash/pipeline/logstash.conf
#tail -f /dev/null
