from helpers import ControllerTest, unittest, test, json, set_trace


class InstanceControllerTest(ControllerTest):

    def test_api_api_control_instance(self):
        result = test.post('/nemea/instances/module1-1/start')
        self.assertEqual(result.status_code, 200)
        result = test.post('/nemea/instances/module1-1/sXQAWE')
        self.assertEqual(result.status_code, 400)
        result = test.post('/nemea/instances/module1-1/stop')
        self.assertEqual(result.status_code, 200)

    def test_api_get_instance_stats_by_name(self):
        result = test.get('/nemea/instances/module1-1/stats')
        self.assertEqual(result.status_code, 200)
        stats = json.loads(result.data)
        self.assertEqual(len(stats['interface']), 2)
        self.assertEqual(stats['stats']['cpu-kern'], '1235')

    def test_api_get_all_instances_stats(self):
        result = test.get('/nemea/instances/stats')
        self.assertEqual(result.status_code, 200)
        stats = json.loads(result.data)
        self.assertEqual(len(stats), 3)

    def test_api_get_instance_by_name(self):
        # invalid instance name
        result = test.get('/nemea/instances/aiosudfioasudf')
        self.assertEqual(result.status_code, 404)

        # valid instance name
        result = test.get('/nemea/instances/ipfixcol1')
        self.assertEqual(result.status_code, 200)
        inst = json.loads(result.data)
        self.assertEqual(inst['name'], 'ipfixcol1')

    def test_api_create_new_instance(self):
        data = {'test': 'test'}
        result = test.post_json('/nemea/instances', data=data)
        self.assertEqual(result.status_code, 400)

        data = {'name': 'test'}
        result = test.post_json('/nemea/instances', data=data)
        self.assertEqual(result.status_code, 400)

        data = {
            "name": "ipfixcol2",
            "module-ref": "ipfixcol",
            "enabled": True,
            "params": ""
        }
        result = test.post_json('/nemea/instances', data=data)
        self.assertEqual(result.status_code, 201)

        data = {
            "name": "link_traffic2",
            "module-ref": "link_traffic",
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

    def test_api_get_all_instances(self):
        result = test.get('/nemea/instances')
        self.assertEqual(result.status_code, 200)
        insts = json.loads(result.data)
        self.assertEqual(len(insts), 3)
        self.assertEqual(insts[0]['name'], 'ipfixcol1')
        self.assertEqual(insts[1]['name'], 'module1-1')
        self.assertEqual(insts[2]['name'], 'link_traffic1')
        self.assertEqual(insts[2]['custom-attributes']['links']['link'][0]['name'], 'aconet')

    def test_api_delete_instance_by_name(self):
        # try to inject command (remove non-existing instance)
        result = test.delete('/nemea/instances/; rm -rf %2f')
        self.assertEqual(result.status_code, 404)

        result = test.delete('/nemea/instances/ipfixcol1')
        self.assertEqual(result.status_code, 204)

        # test if it is really removed
        result = test.get('/nemea/instances/ipfixcol1')
        self.assertEqual(result.status_code, 404)

    def test_api_update_instance_by_name(self):
        # invalid data
        data = {'test':'test'}
        result = test.put_json('/nemea/instances/ipfixcol1', data=data)
        self.assertEqual(result.status_code, 400)

        # invalid data, module-ref key is missing
        data = {'name':'test'}
        result = test.put_json('/nemea/instances/ipfixcol1', data=data)
        self.assertEqual(result.status_code, 400)

        # valid data, invalid name of instance to be updated
        data = {
            "name": "ipfixcol2",
            "module-ref": "ipfixcol",
            "enabled": True,
            "params": ""
        }
        result = test.put_json('/nemea/instances/ipfixcol3', data=data)
        self.assertEqual(result.status_code, 404)

        data = {
            "name": "ipfixcol3",
            "module-ref": "ipfixcol",
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
            "module-ref": "link_traffic",
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


if __name__ == '__main__':
    unittest.main()
