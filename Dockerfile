FROM timbru31/ruby-node:2.5 as builder

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

FROM nginx:1.17.9

COPY --from=builder /usr/src/app/dist/community-app /usr/share/nginx/html

COPY ./nginx.develop.conf /etc/nginx/nginx.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]