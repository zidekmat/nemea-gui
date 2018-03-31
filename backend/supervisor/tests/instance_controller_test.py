from helpers import *
from werkzeug.datastructures import Headers

import subprocess


def create_subscriber():
    import os
    import sys

    father_pid = os.getpid()
    pid = os.fork()
    if pid > 0:
        # this is parent
        return

    os.setsid()

    # do second fork
    try:
        pid = os.fork()
        if pid > 0:
            # exit from second parent
            sys.exit(0)
    except OSError as e:
        print("fork #2 failed: %s" % str(e))
        sys.exit(1)

    subscribe(father_pid)


def change_cb(sess, module_name, event, private_ctx):
    return sr.SR_ERR_OK


def th_subscribe():
    module_name = 'nemea-test-1'
    conn = sr.Connection("subscriber")
    sess = sr.Session(conn, sr.SR_DS_RUNNING)
    subscribe = sr.Subscribe(sess)
    subscribe.module_change_subscribe(module_name, change_cb)
    sr.global_loop()


def subscribe(father_pid):
    from time import sleep
    import os
    import sys

    with open('log', 'a') as fd:
        fd.write("suck asd\n")

    try:
        module_name = 'nemea-test-1'
        conn = sr.Connection("subscriber for %d" % father_pid)
        sess = sr.Session(conn, sr.SR_DS_RUNNING)
        subscribe = sr.Subscribe(sess)
        subscribe.module_change_subscribe(module_name, change_cb)
        while True:
            with open('log', 'a') as fd:
                fd.write("Im subscribed boii\n")
            sleep(0.2)
            try:
                with open('log', 'a') as fd:
                    fd.write("Testing father %d \n"% father_pid)
                os.kill(father_pid, 0)
            except OSError:
                with open('log', 'a') as fd:
                    fd.write("Mi father lives\n")
                pass
            else:
                with open('log', 'a') as fd:
                    fd.write("Im exiting boii\n")
                sys.exit(0)
    except Exception as e:
        with open('log', 'a') as fd:
            fd.write(e)


class InstanceControllerTest(unittest.TestCase):

    def __init__(self, *args, **kwargs):
        super(InstanceControllerTest, self).__init__(*args, **kwargs)
        self.app = liberouterapi.app.test_client()
        data = {"username": "admin","password":"admin","password2":"admin"}
        headers = Headers()
        headers.add('Content-Type', 'application/json')
        self.app.post('/setup', data=json.dumps(data), headers=headers)


    def setUp(self):
        # Make sure there are clean test data in sysrepo before each test
        for ds in ['startup', 'running']:
            subprocess.run(['sysrepocfg', '--del=/nemea-test-1:supervisor',
                              '--datastore=%s' % ds, 'nemea-test-1'],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            subprocess.run(['sysrepocfg', '--import=./data/set1.data.json',
                              '--datastore=%s' % ds,
                              '--format=json', 'nemea-test-1'],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            subprocess.run(['sysrepocfg', '--del=/link-traffic-test-1:instance',
                              '--datastore=%s' % ds, 'link-traffic-test-1'],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            subprocess.run(['sysrepocfg', '--import=./data/link-traffic-test-1.data.json',
                              '--datastore=%s' % ds,
                              '--format=json', 'link-traffic-test-1'],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    def tearDown(self):
        #print('tearing down')
        pass

    def test_get_instance_stats_by_name(self):
        result = test.get('/nemea/instances/module1-1/stats')
        self.assertEqual(result.status_code, 200)
        stats = json.loads(result.data)
        self.assertEqual(len(stats['interface']), 2)
        self.assertEqual(stats['stats']['cpu-kern'], '1235')


    def test_get_all_instances_stats(self):
        result = test.get('/nemea/instances/stats')
        self.assertEqual(result.status_code, 200)
        stats = json.loads(result.data)
        self.assertEqual(len(stats), 3)


    def test_update_instance_by_name(self):
        # invalid data
        data = {'test':'test'}
        result = test.put_json('/nemea/instances/ipfixcol1', data=data)
        self.assertEqual(result.status_code, 400)

        # invalid data, module key is missing
        data = {'name':'test'}
        result = test.put_json('/nemea/instances/ipfixcol1', data=data)
        self.assertEqual(result.status_code, 400)

        # valid data, invalid name of instance to be updated
        data = {
            "name": "ipfixcol2",
            "module-kind": "ipfixcol",
            "enabled": True,
            "params": ""
        }
        result = test.put_json('/nemea/instances/ipfixcol3', data=data)
        self.assertEqual(result.status_code, 404)

        data = {
            "name": "ipfixcol3",
            "module-kind": "ipfixcol",
            "enabled": True,
            "params": "-vsd -1 -ff"
        }
        result = test.put_json('/nemea/instances/ipfixcol1', data=data)
        self.assertEqual(result.status_code, 200)

        # test if it is really changed
        result = test.get('/nemea/instances/ipfixcol1')
        self.assertEqual(result.status_code, 404)
        result = test.get('/nemea/instances/ipfixcol3')
        self.assertEqual(result.status_code, 200)
        self.assertEqual(json.loads(result.data)['params'], "-vsd -1 -ff")
        # test custom-attributes
        data = {
            "name": "link_traffic1",
            "module-kind": "link_traffic",
            "enabled": True,
            "use-sysrepo": True,
            "custom-attributes": {
                "links": {
                    "link": [
                        {
                            "link_id": 0,
                            "name": "aXonet",
                            "color": "490099"
                        }
                    ]
                }
            }
        }
        result = test.put_json('/nemea/instances/link_traffic1', data=data)
        self.assertEqual(result.status_code, 200)
        result = test.get('/nemea/instances/link_traffic1')
        self.assertEqual(result.status_code, 200)
        inst = json.loads(result.data)
        self.assertEqual(inst['custom-attributes']['links']['link'][0]['name'], 'aXonet')

    def test_create_new_instance(self):
        data = {'test':'test'}
        result = test.post_json('/nemea/instances', data=data)
        self.assertEqual(result.status_code, 400)

        data = {'name':'test'}
        result = test.post_json('/nemea/instances', data=data)
        self.assertEqual(result.status_code, 400)

        data = {
            "name": "ipfixcol2",
            "module-kind": "ipfixcol",
            "enabled": True,
            "params": ""
        }
        result = test.post_json('/nemea/instances', data=data)
        self.assertEqual(result.status_code, 201)

        data = {
            "name": "link_traffic2",
            "module-kind": "link_traffic",
            "enabled": True,
            "custom-attributes": {
                "links": {
                    "link": [
                        {
                            "link_id": 0,
                            "name": "aXonet",
                            "color": "490099"
                        }
                    ]
                }
            }
        }
        result = test.post_json('/nemea/instances', data=data)
        self.assertEqual(result.status_code, 201)

    def test_get_all_instances(self):
        result = test.get('/nemea/instances')
        self.assertEqual(result.status_code, 200)
        insts = json.loads(result.data)
        self.assertEqual(len(insts), 3)
        self.assertEqual(insts[0]['name'], 'ipfixcol1')
        self.assertEqual(insts[1]['name'], 'module1-1')
        self.assertEqual(insts[2]['name'], 'link_traffic1')
        self.assertEqual(insts[2]['custom-attributes']['links']['link'][0]['name'], 'aconet')

    def test_get_instance_by_name(self):
        # invalid instance name
        result = test.get('/nemea/instances/aiosudfioasudf')
        self.assertEqual(result.status_code, 404)

        # valid instance name
        result = test.get('/nemea/instances/ipfixcol1')
        self.assertEqual(result.status_code, 200)
        inst = json.loads(result.data)
        self.assertEqual(inst['name'], 'ipfixcol1')

    def test_delete_instance_by_name(self):
        # try to inject command (remove non-existing instance)
        result = test.delete('/nemea/instances/; rm -rf %2f')
        self.assertEqual(result.status_code, 404)

        result = test.delete('/nemea/instances/ipfixcol1')
        self.assertEqual(result.status_code, 204)

        # test if it is really removed
        result = test.get('/nemea/instances/ipfixcol1')
        self.assertEqual(result.status_code, 404)

if __name__ == '__main__':
    #create_subscriber()

    # s _thread se to nekde sekne, nevim kde
    #import _thread
    #_thread.start_new_thread(th_subscribe, ())
    #print('running test')
    unittest.main()
