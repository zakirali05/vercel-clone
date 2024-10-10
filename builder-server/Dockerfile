FROM node

RUN apt-get update
RUN apt-get install git -y

WORKDIR /home/app


COPY main.sh main.sh
COPY script.js script.js
COPY package*.json .

RUN npm install

RUN chmod +x main.sh
RUN chmod +x script.js

ENTRYPOINT [ "/home/app/main.sh" ]