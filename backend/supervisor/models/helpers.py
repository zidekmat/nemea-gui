import json
import subprocess
import libsysrepoPython3 as sr
from pdb import set_trace
from time import time
from liberouterapi.modules.nemea.supervisor.errors import *
from os import environ, remove
from glob import glob


USED_SR_DATASTORE = 'running'
if 'NEMEA_SUPERVISOR_API_TEST' in environ:
    NEMEA_SR_PREFIX = 'nemea-test-1'
else:
    NEMEA_SR_PREFIX = 'nemea'


def sr_get_session():
    conn = sr.Connection("helpers.py")
    if conn is None:
        raise SysrepoError('Failed to connect to sysrepo')

    sess = sr.Session(conn, sr.SR_DS_RUNNING)
    if sess is None:
        raise SysrepoError('Failed to create sysrepo session to running datastore')

    return sess


def sysrepocfg_set_by_xpath(sysrepo_module, xpath, value, datastore=USED_SR_DATASTORE):
    try:
        res = subprocess.run(['sysrepocfg', '--set={}'.format(xpath),
                              '--set-value={}'.format(value),
                              '--datastore={}'.format(datastore),
                              '--format=json', sysrepo_module],
                             stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except Exception as e:
        raise SysrepocfgException('Unknown error during configuration data export'
                                  + str(e))

    if res.stdout == b"The new configuration was successfully applied.\n":
        return

    raise InvalidRequest(
        'Failed to remove data due to: {}/{}'.format(str(res.stdout), str(res.stderr)))


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
        raise SysrepocfgException(
            'Failed to load configuration: {}/{}'.format(str(res.stdout),
                                                         str(res.stderr)))

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
        res = subprocess.run(['sysrepocfg', '--merge={}'.format(fname),
                              '--datastore={}'.format(datastore),
                              '--format=json', sysrepo_module],
                             stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except Exception as e:
        raise SysrepocfgException(
            'Unknown error during configuration data import: ' + str(e))
    finally:
        pass
        #remove(fname)

    if res.stdout == b"The new configuration was successfully applied.\n":
        return

    raise InvalidRequest(
        'Supplied data were invalid. Failed to import due to: {}/{}'.format(
            str(res.stdout), str(res.stderr)))


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

    raise InvalidRequest(
        'Failed to remove data due to: {}/{}'.format(str(res.stdout), str(res.stderr)))


def sysrepocfg_sync_ds(sysrepo_module, from_ds, to_ds):
    fname = '/tmp/supervisorapi-dump-%s.tmp' % time()

    try:
        res = subprocess.run(['sysrepocfg', '--export=%s' % fname,
                              '--datastore={}'.format(from_ds),
                              '--format=json', sysrepo_module],
                             stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except Exception as e:
        raise SysrepocfgException(
            'Unknown error during configuration datastore sync (export):'
            + str(e))

    if res.stdout != b"The configuration was successfully exported.\n":
        remove(fname)
        raise SysrepocfgException(
            'Failed to export configuration from datastore {}: {}/{}'.format(from_ds,
            str(res.stdout), str(res.stderr)))

    try:
        res = subprocess.run(['sysrepocfg', '--import=%s' % fname,
                              '--datastore={}'.format(to_ds),
                              '--format=json', sysrepo_module],
                             stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except Exception as e:
        raise SysrepocfgException(
            'Unknown error during configuration datastore sync (import):'
            + str(e))
    finally:
        remove(fname)

    if res.stdout == b"The new configuration was successfully applied.\n":
        return

    raise InvalidRequest('Unable to import configuration ' +
                         'from datastore {} to {}: {}/{}'.format(
                             from_ds,to_ds, str(res.stdout), str(res.stderr)))


def sysrepocfg_get_stats():
    try:
        res = subprocess.run(['sysrepocfg', '--state-data',
                              '--get={}'.format(
                                  "/" + NEMEA_SR_PREFIX + ":supervisor//*/stats/*"),
                              '--format=json', NEMEA_SR_PREFIX],
                             stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except Exception as e:
        raise SysrepocfgException('Unknown error during state data export:'
                                  + str(e))

    try:
        return json.loads(res.stdout)
    except ValueError:
        raise SysrepocfgException(
            'Unable to parse JSON during state data export: {}/{}'.format(res.stdout,
                                                                          res.stderr))


def sysrepo_get_modules_list():
    def process_paths(path):
        return path.split('/')[-1].split('@')[0].split('.')[0]

    return list(map(process_paths, glob('/etc/sysrepo/yang/*yang')))


def yanglint_get_sr_module(module_name):
    paths = glob('/etc/sysrepo/yang/{}*.yang'.format(module_name))
    if len(paths) == 0:
        raise NotFoundException("Module '{}' has no sysrepo model.".format(module_name))
    paths.sort()
    mod_file = paths[-1]
    model = {}

    for format in ['YANG', 'YIN', 'TREE']:
        try:
            res = subprocess.run(['yanglint', '-f', format, mod_file],
                                 stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        except Exception as e:
            raise YanglintException(
                "Unknown error during formating {} to {}: {}".format(mod_file, format,
                                                                     str(e)))

        if len(res.stderr) > 0:
            raise YanglintException(
                "Unknown error during formating {} to {}: {}/{}".format(mod_file, format,
                                                                        str(res.stdout),
                str(res.stderr)))

        model[format] = str(res.stdout)

    return model
