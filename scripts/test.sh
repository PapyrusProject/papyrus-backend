#!/bin/bash

setup() {
    yarn
    docker compose up -d
    sleep 5
    npx prisma migrate dev
}

cleanup() {
    docker compose down
}

test() {
    npx jest --runInBand --coverage
}

trap cleanup SIGINT
setup
test
cleanup
