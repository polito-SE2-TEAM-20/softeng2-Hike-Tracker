FROM postgis/postgis:14-3.3

COPY db.sql.gz /docker-entrypoint-initdb.d/

ADD postgres.conf /etc

ENV POSTGRES_HOST_AUTH_METHOD=trust
ENV POSTGRES_USER softeng
ENV POSTGRES_PASSWORD demo-pass
ENV POSTGRES_DB hiking

CMD ["postgres", "-c", "config_file=/etc/postgres.conf"]