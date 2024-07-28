#!bin/sh

set -e

mkdir -p /etc/prometheus/certs

CERT_DIR="/etc/prometheus/certs"
CERT_FILE="$CERT_DIR/client.crt"
KEY_FILE="$CERT_DIR/client.key"

echo "$SSL_CERT" > "$CERT_FILE"
echo "$SSL_KEY" > "$KEY_FILE"

chmod 644 /etc/prometheus/certs/client.crt
chmod 644 /etc/prometheus/certs/client.key

/bin/prometheus --config.file=/etc/prometheus/prometheus.yml --storage.tsdb.path=/prometheus #--storage.tsdb.retention.time=1d

