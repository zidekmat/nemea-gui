#!/bin/bash

msg() {
  echo -e "\e[32m[*] $1\e[0m"
}

msg 'Preparing test environment'

# Start Liberouter backend and create new user admin:admin there
python3 ../../../../../backend &
LIBEROUTER_GUI_API_PID=$!

# wait for Liberouter GUI backend to start
sleep 0.5

curl -s -v -X POST \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"admin","password2":"admin"}' \
  http://localhost:5555/setup >/dev/null

kill $LIBEROUTER_GUI_API_PID


# Install testing YANG schemas and data
sysrepoctl --install --yang data/nemea-test-1.yang
sysrepoctl --install --yang data/link-traffic-test-1.yang
sysrepocfg --import=data/set1.data.json --datastore=startup --format=json nemea-test-1

# Compile stats_provider for mock data
gcc -Wall -lsysrepo stats_provider.c -o stats_provider

# Run helper scripts to simulate some of supervisors behaviour
python3 subscriber.py & 
SUBSCRIBER_PID=$!
./stats_provider &
STATS_PROVIDER_PID=$!

msg 'Running instance_controller_test.py'
python3 instance_controller_test.py 

msg 'Running nemea_module_controller_test.py'
python3 nemea_module_controller_test.py 

msg 'Running sysrepo_controller_test.py'
python3 sysrepo_controller_test.py 


msg 'Tearing down test environment'
kill $SUBSCRIBER_PID $STATS_PROVIDER_PID >/dev/null 2>/dev/null
rm -r stats_provider database.sq3 ./*.pyc __pycache__ >/dev/null 2>/dev/null
