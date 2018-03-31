#!/bin/bash


# install test schemas

sysrepocfg --import=data/set1.data.json --datastore=startup --format=json nemea-test-1
gcc -Wall -lsysrepo stats_provider.c -o stats_provider

python3 subscribe.py & 
SUBSCRIBER_PID=$!

./stats_provider &
STATS_PROVIDER_PID=$!


#sleep 0.1
## test subscribe is running
#if ! pgrep -x 'python3 subscribe.py' >/dev/null; then
#  pgrep -x 'python3 '
#  echo 'wat?'
#  read a
#  exit 1
#fi

echo 'Running instance_test.py'
python3 instance_controller_test.py 

kill $SUBSCRIBER_PID $STATS_PROVIDER_PID

# uninstall schemas
