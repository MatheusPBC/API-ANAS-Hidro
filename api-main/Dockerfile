FROM node:18 AS builder

WORKDIR /code

COPY ./package*.json ./
RUN npm i
RUN npm i webpack

COPY . .

FROM builder AS ana

RUN npx nest build ana

ENTRYPOINT [ "/usr/local/bin/node" ]
CMD [ "dist/apps/ana/main" ]

FROM builder AS api

RUN npx nest build api

ENTRYPOINT [ "/usr/local/bin/node" ]
CMD [ "dist/apps/api/main" ]

FROM builder AS cron

RUN npx nest build cron

ENTRYPOINT [ "/usr/local/bin/node" ]
CMD [ "dist/apps/cron/main" ]

FROM builder AS integrated

RUN npx nest build integrated

ENTRYPOINT [ "/usr/local/bin/node" ]
CMD [ "dist/apps/integrated/main" ]

FROM builder AS stations

RUN npx nest build stations

ENTRYPOINT [ "/usr/local/bin/node" ]
CMD [ "dist/apps/stations/main" ]

FROM builder AS users

RUN npx nest build users

ENTRYPOINT [ "/usr/local/bin/node" ]
CMD [ "dist/apps/users/main" ]
