from sys import path
from os import getcwd, environ
environ['NEMEA_SUPERVISOR_API_TEST'] = '1'

# Append to path so we can load liberouterapi
path.append(getcwd() + '/../../../../../backend')
import liberouterapi
import unittest
import json
from werkzeug.datastructures import Headers
try:
    import libsysrepoPython3 as sr
except ImportError:
    raise ImportError("You don't have Python3 bindings for models installed."
                      " See https://github.com/models/models for details on"
                      " how to install it.")


 # TODO remove
from pdb import set_trace


class SupervisorTest:
    def __init__(self):
        self.role = 0
        self.app = liberouterapi.app.test_client()
        self.test_headers = Headers()
        self.test_headers.add('Authorization', 'aaaaaaaaaaaaaaaaa')

    @staticmethod
    def fake_session_lookup(sess_id):
        return {'user': SupervisorTest()}

    def __add_test_headers(self, args):
        if 'headers' not in args:
            args['headers'] = Headers()
        args['headers'].add('Authorization', 'aaaaaaaaaaaa')

        return args

    def get(self, url):
        return self.app.get(url, headers=self.test_headers)

    def post(self, url, **kwargs):
        return self.app.post(url, **self.__add_test_headers(kwargs))

    def delete(self, url, **kwargs):
        return self.app.delete(url, **self.__add_test_headers(kwargs))


    def post_json(self, url, **kwargs):
        kwargs = self.__add_test_headers(kwargs)
        kwargs['headers'].add('Content-Type', 'application/json')
        kwargs['data'] = json.dumps(kwargs['data'])

        return self.app.post(url, **kwargs)

    def put_json(self, url, **kwargs):
        kwargs = self.__add_test_headers(kwargs)
        kwargs['headers'].add('Content-Type', 'application/json')
        kwargs['data'] = json.dumps(kwargs['data'])

        return self.app.put(url, **kwargs)


liberouterapi.app.testing = True
liberouterapi.auth.lookup = SupervisorTest.fake_session_lookup
test = SupervisorTest()
__all__ = ['unittest', 'liberouterapi', 'test', 'set_trace', 'json', 'sr']
