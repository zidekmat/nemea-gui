#!/bin/bash

# Start API via python3 liberouter-gui/backend/ first

curl -v -X POST \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"admin","password2":"admin"}' \
  http://localhost:5555/setup
