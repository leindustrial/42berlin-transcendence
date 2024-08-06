FROM grafana/grafana:latest

USER root

COPY /provisioning /etc/grafana/provisioning

#COPY /provisioning/dashboards/dashboard.json /var/lib/grafana/dashboards/
COPY /provisioning/dashboards/dashboard.json /etc/grafana/provisioning/dashboards/dashboard.json

COPY /provisioning/dashboards/dashboard_provisioning.yml /etc/grafana/provisioning/dashboards/dashboard_provisioning.yml

COPY start_grafana.sh /usr/local/bin/start_grafana.sh

RUN chmod +x /usr/local/bin/start_grafana.sh

#CMD ["/usr/local/bin/start_grafana.sh"]
ENTRYPOINT ["/usr/local/bin/start_grafana.sh"]


