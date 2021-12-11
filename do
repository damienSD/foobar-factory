#!/bin/bash

PROJECT="foobar"

BACK_IMAGE="${PROJECT}-back"
FRONT_IMAGE="${PROJECT}-front"
NETWORK_NAME="${PROJECT}-network"
FACTORY_NAME="${PROJECT}-factory"
REDIS_NAME="${PROJECT}-redis"
ROBOT_NAME="${PROJECT}-robot"
FRONT_NAME="${PROJECT}-front"

PORT=8000

SPEED_FACTOR=1
FOOBAR_PRICE=1

ENVS="\
    --env PROJECT=$PROJECT \
    --env BACK_IMAGE=$BACK_IMAGE \
    --env FRONT_IMAGE=$FRONT_IMAGE \
    --env NETWORK_NAME=$NETWORK_NAME \
    --env FACTORY_NAME=$FACTORY_NAME \
    --env REDIS_NAME=$REDIS_NAME \
    --env ROBOT_NAME=$ROBOT_NAME \
    --env FRONT_NAME=$FRONT_NAME \
    --env SPEED_FACTOR=$SPEED_FACTOR \
"

start() {
    echo -e "[Foobar factory] Starting..."
    clean
    prepare
    docker run -tti --detach $ENVS --name ${FACTORY_NAME} --network ${NETWORK_NAME} -v $(pwd)/back/:/app/ -v /var/run/docker.sock:/var/run/docker.sock ${BACK_IMAGE} >/dev/null 2>&1
    docker run -tti --detach $ENVS --name ${FRONT_NAME} --network ${NETWORK_NAME} -p "$PORT:8000" -v $(pwd)/front/:/app/ ${FRONT_IMAGE} >/dev/null 2>&1
    waitAndDebug --filter "name=${FACTORY_NAME}" --filter "name=${ROBOT_NAME}"
    clean
}

dev() {
    echo -e "[Foobar factory] Starting dev..."
    clean
    prepare
    docker run -tti --detach $ENVS --name ${FACTORY_NAME} --network ${NETWORK_NAME} -v $(pwd)/back/:/app/ -v /var/run/docker.sock:/var/run/docker.sock ${BACK_IMAGE}
    docker run -tti --detach $ENVS --name ${FRONT_NAME} --network ${NETWORK_NAME} -p "$PORT:8000" -v $(pwd)/front/pages:/app/pages -v $(pwd)/front/package.json:/app/package.json -v $(pwd)/front/next.config.js:/app/next.config.js ${FRONT_IMAGE} yarn run dev 
    docker run -tti --detach $ENVS --name ${PROJECT}-redis-admin -p "8081:8081" --network ${NETWORK_NAME} --env REDIS_HOSTS=local:$REDIS_NAME:6379 rediscommander/redis-commander:latest 
    waitAndDebug --filter "name=${PROJECT}*"
    clean
}

prepare() {
    docker build --quiet -t ${BACK_IMAGE} ./back/  >/dev/null 2>&1
    docker build --quiet -t ${FRONT_IMAGE} ./front/ >/dev/null 2>&1
    docker network create  ${NETWORK_NAME}  >/dev/null 2>&1
}

clean() {
    for id in $(docker ps -a -q --filter "name=${PROJECT}*"); do
        docker rm -f $id >/dev/null 2>&1;
    done
    docker network remove ${NETWORK_NAME} >/dev/null 2>&1
}

black() {
    docker run -tti --rm -v $(pwd):/app/ ${BACK_IMAGE} black ./ -l 120
}

waitAndDebug() {
    names=("test")
    while [ true ]; do

        for name in $(docker ps -a --format "{{.Names}}" $@); do
            if [[ ! ${names[@]} =~ (^|[[:space:]])"$name"($|[[:space:]]) ]] ; then
                local prefix=$(echo -e "\e[38;5;$(shuf -i 50-200 -n 1)m${name}\e[0m") 
                eval "docker logs -f  \"$name\" | sed -e \"s/^/$prefix >> /\" &";
                names+=("$name") 
            fi
        done
        sleep 1
    done
    wait
}

end() {
    echo -e "[Foobar factory] Stopping..."
    clean
    exit
}

trap end EXIT
trap end SIGINT


$@