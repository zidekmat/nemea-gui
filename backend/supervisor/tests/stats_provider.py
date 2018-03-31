import libsysrepoPython3 as sr

from pdb import set_trace

def interface_get_stats_cb(xpath, values, values_cnt, private_ctx):
    return sr.SR_ERR_OK


def inst_get_stats_cb(a,b,c,d):
    print('called it')
    set_trace()
    return sr.SR_ERR_OK


def prodive_stats():
    module_name = 'nemea-test-1'
    conn = sr.Connection("subscriber")
    sess = sr.Session(conn, sr.SR_DS_RUNNING)
    subscribe = sr.Subscribe(sess)
    subscribe.dp_get_items_subscribe("/nemea-test-1:supervisor/module/stats", inst_get_stats_cb, 0, sr.SR_SUBSCR_DEFAULT)
    print('subscribed')
    #subscribe.dp_get_items_subscribe("/nemea-test-1:supervisor/module/interface/stats", interface_get_stats_cb)
    sr.global_loop()


if __name__ == '__main__':
    prodive_stats()

