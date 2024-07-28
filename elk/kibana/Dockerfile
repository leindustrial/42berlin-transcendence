FROM kibana:8.14.3

USER root

RUN apt-get update && apt-get install nano

COPY kibana.yml /usr/share/kibana/config/kibana.yml

COPY start_kibana.sh /usr/share/kibana/bin/start_kibana.sh

RUN chmod +x /usr/share/kibana/bin/start_kibana.sh

USER kibana

CMD ["sh", "/usr/share/kibana/bin/start_kibana.sh"]
