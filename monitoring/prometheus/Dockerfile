FROM prom/prometheus

USER root

COPY prometheus.yml /etc/prometheus/prometheus.yml
COPY alert_rules.yml /etc/prometheus/alert_rules.yml
COPY sample-rules.yml /etc/prometheus/sample-rules.yml
COPY cert_gen.sh /etc/prometheus/cert_gen.sh

RUN chmod +x /etc/prometheus/cert_gen.sh

ENTRYPOINT ["sh", "/etc/prometheus/cert_gen.sh"]
