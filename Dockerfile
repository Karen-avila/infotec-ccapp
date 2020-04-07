FROM node:10.19.0-buster as builder

RUN export DEBIAN_FRONTEND=noninteractive && apt-get update \
	&& apt-get install -y --no-install-recommends ruby-full && gem install bundler && rbenv rehash \	
	&& apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*


RUN mkdir /usr/src/app

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json /usr/src/app/package.json

RUN npm install -g bower

RUN npm install -g grunt-cli

COPY . /usr/src/app

RUN bower --allow-root install

RUN npm install

RUN bundle install

RUN grunt prod

FROM nginx AS runner

RUN export DEBIAN_FRONTEND=noninteractive && apt-get update \
	&& apt-get install -y --no-install-recommends wget telnet unzip tzdata telnet vim dos2unix curl software-properties-common gnupg apt-transport-https \
	&& ln -fs /usr/share/zoneinfo/America/Mexico_City /etc/localtime \
	&& dpkg-reconfigure --frontend noninteractive tzdata dos2unix \
	&& apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY --from=builder /usr/src/app/dist/community-app /usr/share/nginx/html

COPY ./nginx.develop.conf /etc/nginx/nginx.conf

COPY ./options-ssl-nginx.conf /etc/nginx/options-ssl-nginx.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
