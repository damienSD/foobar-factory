FROM node:16.5-buster

ENV NODE_OPTIONS='--max_old_space_size=4096'
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app/
COPY *.json *.lock ./
RUN yarn --network-timeout 100000
RUN npx next telemetry disable
ENV PORT=8000

COPY ./ ./

CMD ["yarn", "run"  ,"start"]