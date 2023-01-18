# Set the base image to node
FROM node:erbium

# Set basic AWS credentials and API Key variables
ENV AWS_ACCESS_KEY_ID XXID
ENV AWS_SECRET_ACCESS_KEY XXSECRET
ENV AWS_SESSION_TOKEN XXTOKEN
ENV SEATGEEK XXSEAT
ENV YOUTUBE XXYOUTUBE
ENV WEATHER XXWEATHER

COPY /mashup /mashup

# Set work directory to /src
WORKDIR /mashup

RUN npm install

EXPOSE 3000

CMD node app.js