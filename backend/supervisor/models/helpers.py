try:
    import libsysrepoPython3 as sr
except ImportError:
    raise ImportError("You don't have Python3 bindings for models installed."
                      " See https://github.com/models/models for details on"
                      " how to install it.")

import json
import subprocess
from os import environ
from pdb import set_trace
from time import time

if 'NEMEA_SUPERVISOR_API_TEST' in environ:
    NEMEA_SR_PREFIX = 'nemea-test-1'
    USED_SR_DATASTORE = sr.SR_DS_STARTUP
else:
    NEMEA_SR_PREFIX = 'nemea'
    USED_SR_DATASTORE = sr.SR_DS_RUNNING


class SysrepocfgException(Exception):
    pass


def sysrepocfg_fetch(sysrepo_module, datastore='startup'):
    fname = '/tmp/supervisorapi-dump-%s.tmp' % time()

    try:
        res = subprocess.run(['sysrepocfg', '--export=%s' % fname,
                              '--datastore=%s' % datastore,
                              '--format=json', sysrepo_module],
                             stdout=subprocess.PIPE)
    except Exception as e:
        raise SysrepocfgException(e.message)

    if res.stdout != b"The configuration was successfully exported.\n":
        raise SysrepocfgException(res.stdout)

    try:
        with open(fname) as fd:
            return json.loads(fd.read())
    except Exception as e:
        raise SysrepocfgException(e.message)



__all__ = ['NEMEA_SR_PREFIX', 'USED_SR_DATASTORE', 'set_trace', 'sr', 'sysrepocfg_fetch', 'SysrepocfgException']

