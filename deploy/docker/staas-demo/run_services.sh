#!/bin/bash

# Start MongoDB, it's reguired by NEMEA GUI
mkdir -p /data/db 2>/dev/null
mongod --fork --logpath /var/log/mongod.log

mkdir /var/log/nemea-supervisor
sysrepocfg --import=/var/nemea_source/nemea-supervisor-sysrepo-edition/yang/data/nemea-staas-light-startup-config.data.xml \
  --format=xml --datastore=startup nemea
/var/nemea_source/nemea-supervisor-sysrepo-edition/build/src/nemea-supervisor -d -v 2 -L /var/log/nemea-supervisor

httpd

while [ 1 ]; do
  sleep 30
done
