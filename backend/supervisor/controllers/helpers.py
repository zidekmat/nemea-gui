from liberouterapi import auth
from liberouterapi.role import Role
from flask import request, jsonify, Response
from time import time
import subprocess
from os import environ, remove
import json
from glob import glob


from liberouterapi.modules.nemea.supervisor.models.sysrepo_connection import sysrepo_connection
from liberouterapi import app

 # TODO remove
from pdb import set_trace

def handler(fn):
    """
    Decorator to handle invalid use of this API

    except InvalidContentTypeError
        response.code = 400
    except NotFoundError
        response.code = 404
    except SupervisorNotRunningError:
        response.code = 503
    except Exception:
        response.code = 500

    :return:
    """



if 'NEMEA_SUPERVISOR_API_TEST' in environ:
    NEMEA_SR_PREFIX = 'nemea-test-1'
    USED_SR_DATASTORE = 'startup'
else:
    NEMEA_SR_PREFIX = 'nemea'
    USED_SR_DATASTORE = 'running'


class SupervisorException(Exception):

    def __init__(self, message):
        Exception.__init__(self)
        self.message = message


class InternalError(Exception):
    pass


class SysrepocfgException(Exception):
    pass


class YanglintException(Exception):
    pass


class NotFoundException(Exception):
    pass


class InvalidRequest(Exception):
    pass


def error_handler(error, status):
    response = jsonify({'message': str(error)})
    response.status_code = status
    return response


@app.errorhandler(SysrepocfgException)
def handle_sysrepocfg_exception(error):
    return error_handler(error, 500)

@app.errorhandler(YanglintException)
def handle_sysrepocfg_exception(error):
    return error_handler(error, 500)

@app.errorhandler(InternalError)
def handle_sysrepocfg_exception(error):
    return error_handler(error, 500)

@app.errorhandler(NotFoundException)
def handle_not_found_exception(error):
    return error_handler(error, 404)


@app.errorhandler(InvalidRequest)
def handle_not_found_exception(error):
    return error_handler(error, 400)


def json_resp(data, status=200):
    resp = jsonify(data)
    resp.status_code = status
    return resp


def sysrepocfg_fetch_by_xpath(sysrepo_module, xpath, datastore=USED_SR_DATASTORE):
    try:
        res = subprocess.run(['sysrepocfg', '--get={}'.format(xpath),
                              '--datastore={}'.format(datastore),
                              '--format=json', sysrepo_module],
                             stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except Exception as e:
        raise SysrepocfgException('Unknown error during configuration data export'
                                  + str(e))
    set_trace()


def sysrepocfg_fetch(sysrepo_module, datastore=USED_SR_DATASTORE):
    fname = '/tmp/supervisorapi-dump-%s.tmp' % time()

    try:
        res = subprocess.run(['sysrepocfg', '--export=%s' % fname,
                              '--datastore={}'.format(datastore),
                              '--format=json', sysrepo_module],
                             stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except Exception as e:
        raise SysrepocfgException('Unknown error during configuration data export'
                                  + str(e))

    if res.stdout != b"The configuration was successfully exported.\n":
        raise SysrepocfgException('Failed to load configuration: {}/{}'.format(str(res.stdout), str(res.stderr)))

    try:
        with open(fname) as fd:
            content = fd.read()
            if len(content) == 0:
                return None
            return json.loads(content)
    except Exception as e:
        raise SysrepocfgException('Failed to load temporary configuration dump file:' +
                                  str(e))
    finally:
        try:
            remove(fname)
        except:
            pass


def sysrepocfg_merge(sysrepo_module, data, datastore=USED_SR_DATASTORE):
    fname = '/tmp/supervisorapi-dump-%s.tmp' % time()

    try:
        with open(fname, 'w') as fd:
            fd.write(json.dumps(data))
    except Exception as e:
        raise SysrepocfgException('Failed to create temporary import file:' + str(e))

    try:
        res = subprocess.run(['sysrepocfg', '--merge=%s' % fname,
                              '--datastore={}'.format(datastore),
                              '--format=json', sysrepo_module],
                             stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except Exception as e:
        raise SysrepocfgException('Unknown error during configuration data import: ' + str(e))
    finally:
        remove(fname)

    if res.stdout == b"The new configuration was successfully applied.\n":
        return

    raise InvalidRequest('Supplied data were invalid. Failed to import due to: {}/{}'.format(str(res.stdout), str(res.stderr)))


def sysrepocfg_update_at(sysrepo_module, xpath, value, datastore=USED_SR_DATASTORE):
    try:
        res = subprocess.run(['sysrepocfg', '--set=%s' % xpath, '--set-value=%s' % value,
                              '--datastore={}'.format(datastore), sysrepo_module],
                             stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except Exception as e:
        raise SysrepocfgException('Unknown error during configuration data import'
                                  + str(e))

    if res.stdout == b"The new configuration was successfully applied.\n":
        return

    raise InvalidRequest('Supplied data were invalid. Failed to import due to: ' +
                         str(res.stderr))


def sysrepocfg_delete(sysrepo_module, xpath, datastore=USED_SR_DATASTORE):
    try:
        res = subprocess.run(['sysrepocfg', '--del=%s' % xpath,
                              '--datastore={}'.format(datastore), sysrepo_module],
                             stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except Exception as e:
        raise SysrepocfgException('Unknown error during attempt to remove data: '
                                  + str(e))

    if res.stdout == b"The new configuration was successfully applied.\n":
        return

    raise InvalidRequest('Failed to remove data due to: {}/{}'.format(str(res.stdout), str(res.stderr)))


def sysrepocfg_sync_ds(sysrepo_module, from_ds, to_ds):
    fname = '/tmp/supervisorapi-dump-%s.tmp' % time()

    try:
        res = subprocess.run(['sysrepocfg', '--export=%s' % fname,
                              '--datastore={}'.format(from_ds),
                              '--format=json', sysrepo_module],
                             stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except Exception as e:
        raise SysrepocfgException('Unknown error during configuration datastore sync (export):'
                                  + str(e))

    if res.stdout != b"The configuration was successfully exported.\n":
        raise SysrepocfgException('Failed to export configuration from datastore {}: {}/{}'.format(from_ds),str(res.stdout),str(res.stderr))


    try:
        res = subprocess.run(['sysrepocfg', '--import=%s' % fname,
                              '--datastore={}'.format(to_ds),
                              '--format=json', sysrepo_module],
                             stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except Exception as e:
        raise SysrepocfgException('Unknown error during configuration datastore sync (import):'
                                  + str(e))

    if res.stdout == b"The new configuration was successfully applied.\n":
        return

    raise InvalidRequest('Unable to import configuration from datastore {} to {}: {}/{}'.format(from_ds, to_ds, str(res.stdout), str(res.stderr)))


def sysrepocfg_get_stats():
    try:
        res = subprocess.run(['sysrepocfg', '--state-data',
                              '--get={}'.format("/"+NEMEA_SR_PREFIX+":supervisor//*/stats/*"),
                              '--format=json', NEMEA_SR_PREFIX],
                             stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except Exception as e:
        raise SysrepocfgException('Unknown error during state data export:'
                                  + str(e))

    try:
        return json.loads(res.stdout)
    except ValueError:
        raise SysrepocfgException('Unable to parse JSON during state data export: {}/{}'.format(res.stdout, res.stderr))


def sysrepo_get_models_list():
    def process_paths(path):
        return path.split('/')[-1].split('@')[0]
    return list(map(process_paths, glob('/etc/sysrepo/yang/*yang')))


def yanglint_get_model(module_name):
    paths = glob('/etc/sysrepo/yang/{}*.yang'.format(module_name))
    if len(paths) == 0:
        raise NotFoundException("Module '{}' has no sysrepo model.".format(module_name))
    paths.sort()
    mod_file = paths[-1]
    model = {}

    for format in ['yang', 'yin', 'tree']:
        try:
            res = subprocess.run(['yanglint', '-f', format, mod_file],
                                 stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        except Exception as e:
            raise YanglintException("Unknown error during formating {} to {}: {}".format(mod_file, format, str(e)))

        if len(res.stderr) > 0:
            raise YanglintException("Unknown error during formating {} to {}: {}/{}".format(mod_file, format, str(res.stdout)), str(res.stderr))

        model[format] = res.stdout

    return model


def sr_xpaths_to_json():
    pass


def sr_xpaths_from_json(obj):
    pass


__all__ = ['auth', 'Role', 'request', 'set_trace', 'sysrepo_connection', 'jsonify', 'app',
           'sysrepocfg_fetch', 'SysrepocfgException', 'NEMEA_SR_PREFIX', 'USED_SR_DATASTORE',
           'NotFoundException', 'error_handler', 'json_resp', 'InvalidRequest',
           'sysrepocfg_merge', 'sysrepocfg_delete', 'Response', 'sysrepocfg_sync_ds',
           'sysrepo_get_models_list', 'yanglint_get_model', 'InternalError', 'sysrepocfg_fetch_by_xpath', 'sysrepocfg_get_stats']
