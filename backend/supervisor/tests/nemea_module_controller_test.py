from helpers import ControllerTest, unittest, test, json, set_trace


class NemeaModuleControllerTest(ControllerTest):

    def test_api_update_nemea_module_by_name(self):
        # invalid data
        data = {'test': 'test'}
        result = test.put_json('/nemea/modules/ipfixcol', data=data)
        self.assertEqual(result.status_code, 400)

        # invalid data, required fields are missing
        data = {'name': 'test'}
        result = test.put_json('/nemea/modules/ipfixcol', data=data)
        self.assertEqual(result.status_code, 400)

        # valid data and invalid name of instance to be updated
        data = {
            "name": "IPFIXCOL",
            "path": "/a/XXXXX/c",
            "description": "cccccc",
            "use-trap-ifces": False,
            "trap-monitorable": True,
            "is-sysrepo-ready": False
        }
        result = test.put_json('/nemea/modules/ipfixcoL3', data=data)
        self.assertEqual(result.status_code, 404)

        # try again with valid name that would change
        result = test.put_json('/nemea/modules/ipfixcol', data=data)
        self.assertEqual(result.status_code, 200)

        # test if it is really changed
        result = test.get('/nemea/modules/ipfixcol')
        self.assertEqual(result.status_code, 404)
        result = test.get('/nemea/modules/IPFIXCOL')
        self.assertEqual(result.status_code, 200)
        self.assertEqual(json.loads(result.data)['path'], "/a/XXXXX/c")

    def test_api_delete_nemea_module_by_name(self):
        # try to inject command (remove non-existing module)
        result = test.delete('/nemea/modules/; rm -rf %2fhome%2fuser')
        self.assertEqual(result.status_code, 404)

        result = test.delete('/nemea/modules/ipfixcol')
        self.assertEqual(result.status_code, 204)

        # test if it is really removed
        result = test.get('/nemea/modules/ipfixcol')
        self.assertEqual(result.status_code, 404)

    def test_api_create_new_nemea_module(self):
        data = {'test': 'test'}
        result = test.post_json('/nemea/modules', data=data)
        self.assertEqual(result.status_code, 400)

        data = {'name': 'ipfixcol'}
        result = test.post_json('/nemea/modules', data=data)
        self.assertEqual(result.status_code, 400)

        data = {
            "name": "vportscan_detector",
            "path": "/a/b/c",
            "description": "cccccc",
            "use-trap-ifces": False,
            "trap-monitorable": True,
            "is-sysrepo-ready": False
        }
        result = test.post_json('/nemea/modules', data=data)
        self.assertEqual(result.status_code, 201)

    def test_api_get_instances_by_nemea_module_name(self):
        result = test.get('/nemea/modules/asdfasdf/instances')
        self.assertEqual(result.status_code, 404)

        result = test.get('/nemea/modules/ipfixcol/instances')
        self.assertEqual(result.status_code, 200)
        insts = json.loads(result.data)
        self.assertEqual(len(insts), 1)
        self.assertEqual(insts[0]['name'], 'ipfixcol1')

    def test_api_get_all_nemea_modules(self):
        result = test.get('/nemea/modules')
        self.assertEqual(result.status_code, 200)
        mods = json.loads(result.data)
        self.assertEqual(len(mods), 3)
        for idx, mod_name in enumerate(['ipfixcol', 'module1', 'link_traffic']):
            self.assertEqual(mod_name, mods[idx]['name'])

    def test_api_get_nemea_module_by_name(self):
        result = test.get('/nemea/modules/asdasd')
        self.assertEqual(result.status_code, 404)

        result = test.get('/nemea/modules/link_traffic')
        self.assertEqual(result.status_code, 200)
        mod = json.loads(result.data)
        self.assertEqual(mod['name'], 'link_traffic')



if __name__ == '__main__':
    unittest.main()