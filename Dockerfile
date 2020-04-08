FROM node:10.19.0-buster as builder

RUN export DEBIAN_FRONTEND=noninteractive && apt-get update \
	&& apt-get install -y --no-install-recommends locales dos2unix curl gnupg2 \	
	&& gpg2 --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB \
	&& \curl -sSL https://get.rvm.io | bash -s stable \
	&& /bin/bash -l -c "rvm requirements" \
	&& /bin/bash -l -c "rvm install 2.6.1" \
	&& /bin/bash -l -c "echo \"gem: --no-ri --no-rdoc\" > ~/.gemrc && gem install bundler && gem install sass" \	
	&& export LANGUAGE=en_MX.UTF-8 \
	&& export LANG=es_MX.UTF-8 \
	&& export LC_ALL=es_MX.UTF-8 \
	&& echo "es_MX UTF-8" > /etc/locale.gen \
	&& locale-gen es_MX.UTF-8 \
	dpkg-reconfigure locales \
	&& ln -fs /usr/share/zoneinfo/America/Mexico_City /etc/localtime \
	&& dpkg-reconfigure --frontend noninteractive tzdata dos2unix \
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

RUN export PATH=$PATH:/usr/local/rvm/bin:/usr/local/rvm/sbin && bundle install

RUN find . -type f -print0 | xargs -0 dos2unix

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
