#!/usr/bin/env python
import libsysrepoPython3 as sr
import sys

def module_change_cb(sess, module_name, event, private_ctx):
    return sr.SR_ERR_OK

try:
    module_name = 'nemea-test-1'
    conn = sr.Connection("example_application")
    sess = sr.Session(conn, sr.SR_DS_RUNNING)
    subscribe = sr.Subscribe(sess)
    subscribe.module_change_subscribe(module_name, module_change_cb)
    sr.global_loop()

except Exception as e:
    print(e)
