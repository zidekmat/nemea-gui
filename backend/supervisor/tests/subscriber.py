"""
This file is used to pretend that NEMEA Supervisor and link_traffic are subscribed to
running datastore changes in sysrepo. Without this there would be no running datastore
to test on.
"""

import libsysrepoPython3 as sr


def change_cb(sess, module_name, event, private_ctx):
    return sr.SR_ERR_OK


def subscribe():
    conn = sr.Connection("subscriber")
    sess = sr.Session(conn, sr.SR_DS_RUNNING)
    subscribe1 = sr.Subscribe(sess)
    subscribe1.module_change_subscribe('nemea-test-1', change_cb)
    subscribe2 = sr.Subscribe(sess)
    subscribe2.module_change_subscribe('link-traffic-test-1', change_cb)
    sr.global_loop()


if __name__ == '__main__':
    subscribe()

