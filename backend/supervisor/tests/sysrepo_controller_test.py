from helpers import ControllerTest, unittest, test, json, set_trace

class SysrepoControllerTest(ControllerTest):

    def test_api_sysrepo_load_json(self):
        data = {
            "nemea-test-1:supervisor": {
                "available-module": [
                    {
                        "name": "vportscan_detector",
                        "path": "/a/b/c",
                        "description": "cccccc",
                        "use-trap-ifces": False,
                        "trap-monitorable": True,
                        "is-sysrepo-ready": False
                    }
                ]
            }
        }
        result = test.get('/nemea/modules/vportscan_detector')
        self.assertEqual(result.status_code, 404)
        result = test.post_json('/nemea/sysrepo/load/nemea-test-1', data=data)
        self.assertEqual(result.status_code, 200)
        result = test.get('/nemea/modules/vportscan_detector')
        self.assertEqual(result.status_code, 200)

    def test_api_get_sysrepo_module_by_name(self):
        result = test.get("/nemea/sysrepo/modules/nemea-test-1")
        self.assertEqual(result.status_code, 200)
        data = json.loads(result.data)
        self.assertEqual(len(data.keys()), 4)

        result = test.get("/nemea/sysrepo/modules/nemea-test-1?sysrepo_module_type=YIN")
        self.assertEqual(result.status_code, 200)
        data = json.loads(result.data)
        self.assertEqual(len(data.keys()), 2)
        self.assertTrue('YIN' in data)
        
    def test_api_get_all_sysrepo_modules(self):
        result = test.get("/nemea/sysrepo/modules")
        self.assertEqual(result.status_code, 200)
        data = json.loads(result.data)
        self.assertTrue('nemea-test-1' in data)


if __name__ == '__main__':
    unittest.main()
