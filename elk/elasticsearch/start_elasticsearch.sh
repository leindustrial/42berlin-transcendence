#!/bin/bash

set -e

CERT_DIR="/usr/share/elasticsearch/config/certs"
CERT_FILE="$CERT_DIR/elasticsearch.crt"
KEY_FILE="$CERT_DIR/elasticsearch.key"

mkdir -p "$CERT_DIR"

echo "$SSL_CERT" > "$CERT_FILE"
echo "$SSL_KEY" > "$KEY_FILE"
echo "$ELASTIC_PASSWORD" > /usr/share/elasticsearch/config/elasticsearch-pw.txt

chown -R elasticsearch:elasticsearch "$CERT_DIR"
chmod 600 "$KEY_FILE"
chmod 644 "$CERT_FILE"

echo "ELASTIC_PASSWORD is set to: $ELASTIC_PASSWORD"

/usr/local/bin/docker-entrypoint.sh elasticsearch &

# until curl -u elastic:$ELASTIC_PASSWORD --cacert "$CERT_FILE" -X GET "https://localhost:9200/" >/dev/null 2>&1; do
#   echo "Waiting for Elasticsearch to start..."
#   sleep 5
# done

# curl -u elastic:$ELASTIC_PASSWORD --cacert "$CERT_FILE" -X PUT "https://localhost:9200/_ilm/policy/your_policy_name" -H "Content-Type: application/json" -d @/usr/share/elasticsearch/config/ilm-policy.json

# curl -u elastic:$ELASTIC_PASSWORD --cacert "$CERT_FILE" -X PUT "https://localhost:9200/_index_template/your_template_name" -H "Content-Type: application/json" -d @/usr/share/elasticsearch/config/index-template.json

#wait
tail -f /dev/null
