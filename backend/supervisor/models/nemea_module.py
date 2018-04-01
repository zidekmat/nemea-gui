from .helpers import *
from . import instance as i_model


def get_by_name(nmod_name):
    data = sysrepocfg_fetch(NEMEA_SR_PREFIX)
    if data is None:
        raise NotFoundException("No configuration data found.")

    mods = data['{}:supervisor'.format(NEMEA_SR_PREFIX)]['available-module']
    for mod in mods:
        if mod['name'] == nmod_name:
            return mod

    raise NotFoundException("NEMEA module '%s' was not found in supervisor's configuration." % nmod_name)


def get_all():
    data = sysrepocfg_fetch(NEMEA_SR_PREFIX)
    if data is None:
        return []

    base_key = '{}:supervisor'.format(NEMEA_SR_PREFIX)
    return data[base_key]['available-module']


def create(data):
    if 'name' not in data:
        raise InvalidRequest("Key 'name' is missing.")
    validate_nemea_module_name_doesnt_exist(data['name'])

    base_key = '{}:supervisor'.format(NEMEA_SR_PREFIX)
    json_data = {base_key: {'available-module': [data]}}

    sysrepocfg_merge(NEMEA_SR_PREFIX, json_data, 'running')
    sysrepocfg_sync_ds(NEMEA_SR_PREFIX, 'running', 'startup')


def delete(nmod):
    insts = i_model.get_all()
    for inst in insts:
        i_model.delete(inst, nmod)

    xpath = "/{}:supervisor/available-module[name='{}']".format(NEMEA_SR_PREFIX, nmod['name'])
    sysrepocfg_delete(NEMEA_SR_PREFIX, xpath, 'running')
    sysrepocfg_sync_ds(NEMEA_SR_PREFIX, 'running', 'startup')


def update(nmod, data):
    if 'name' not in data:
        raise InvalidRequest("Key 'name' is missing.")

    base_key = '{}:supervisor'.format(NEMEA_SR_PREFIX)
    json_update_data = {
        base_key: {
            'available-module': [data]
        }
    }

    try:
        name_is_changed = nmod['name'] != data['name']
        sysrepocfg_merge(NEMEA_SR_PREFIX, json_update_data, 'startup')

        if name_is_changed:
            # update module-ref in all instances of this module
            my_insts = i_model.get_by_nemea_module_name(nmod['name'])
            for inst in my_insts:
                xpath = "/{}:supervisor/instance[name='{}']/module-ref".format(NEMEA_SR_PREFIX, inst['name'])
                sysrepocfg_set_by_xpath(NEMEA_SR_PREFIX, xpath, data['name'], 'startup')

            # previous sysrepocfg_merge create module with new name so delete old module
            xpath = "/{}:supervisor/available-module[name='{}']".format(NEMEA_SR_PREFIX, nmod['name'])
            sysrepocfg_delete(NEMEA_SR_PREFIX, xpath, 'startup')

    except:
        # recover by copying running to startup
        sysrepocfg_sync_ds(NEMEA_SR_PREFIX, 'running', 'startup')
        raise

    # Update was success, sync startup to running. this should not fail
    sysrepocfg_sync_ds(NEMEA_SR_PREFIX, 'startup', 'running')


def validate_nemea_module_name_doesnt_exist(nmod_name):
    try:
        get_by_name(nmod_name)
        raise InvalidRequest(
            "NEMEA module '%s' already exists in supervisor's configuration." %
            nmod_name)
    except NotFoundException:
        pass