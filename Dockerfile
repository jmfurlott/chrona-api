FROM ubuntu:bionic

RUN apt-get update && \
    apt-get -yq upgrade && \
    apt-get -yq install build-essential curl git-core \
        nginx nginx-extras supervisor libpq-dev vim
RUN rm /etc/nginx/sites-enabled/default

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get -yq install nodejs
RUN ln -s /usr/bin/nodejs /usr/local/bin/node

# COPY etc/nginx.conf /etc/nginx/nginx.conf
COPY etc/supervisord.conf /etc/supervisor/conf.d/
RUN mkdir -p /var/log/app

# Install dependencies
RUN mkdir -pv /srv

COPY ./package*.json /srv/
RUN cd /srv && npm install

COPY . /srv/

CMD /srv/etc/start.sh

EXPOSE 3000