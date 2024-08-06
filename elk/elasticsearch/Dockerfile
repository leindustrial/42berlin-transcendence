FROM docker.elastic.co/elasticsearch/elasticsearch:8.14.3

USER root

COPY start_elasticsearch.sh /usr/local/bin/start_elasticsearch.sh
COPY ilm-policy.json /usr/share/elasticsearch/config/ilm-policy.json
COPY index-template.json /usr/share/elasticsearch/config/index-template.json
COPY elasticsearch.yml /usr/share/elasticsearch/config/elasticsearch.yml

RUN chmod +x /usr/local/bin/start_elasticsearch.sh

USER elasticsearch

ENTRYPOINT ["/bin/bash", "-c"]
CMD ["/usr/local/bin/start_elasticsearch.sh"]

