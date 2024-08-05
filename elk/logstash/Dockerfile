FROM docker.elastic.co/logstash/logstash:8.14.3

USER root

COPY pipeline/ /usr/share/logstash/pipeline/
COPY config/ /usr/share/logstash/config/
COPY ./pipeline/logstash.conf /usr/share/logstash/pipeline/logstash.conf
COPY ./start_logstash.sh /usr/share/logstash/start_logstash.sh

#RUN bin/logstash-plugin install logstash-input-gelf --version 6.4.0

RUN chmod +x /usr/share/logstash/start_logstash.sh

USER logstash

CMD ["sh", "/usr/share/logstash/start_logstash.sh"]