FROM node:16.5-buster

ENV NODE_OPTIONS='--max_old_space_size=4096'
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8000
ENV TSC_COMPILE_ON_ERROR=true

WORKDIR /app/
COPY *.json *.lock ./
RUN yarn --network-timeout 100000
RUN npx next telemetry disable

COPY ./ ./

CMD ["yarn", "run", "start"]