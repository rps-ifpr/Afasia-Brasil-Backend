#!/bin/bash

npm install --legacy-peer-deps
node ace build --production
cp -r .env build/.env

cd build
npm ci --production -f

node server.js
