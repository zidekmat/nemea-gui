from .helpers import *
from . import instance as i_model


def get_nemea_module_by_name(nmod_name):
    data = sysrepocfg_fetch(NEMEA_SR_PREFIX)
    if data is None:
        raise NotFoundException("No configuration data found.")

    mods = data['{}:supervisor'.format(NEMEA_SR_PREFIX)]['available-module']
    for mod in mods:
        if mod['name'] == nmod_name:
            return mod

    raise NotFoundException("NEMEA module '%s' was not found in supervisor's configuration." % nmod_name)


def get_nemea_modules():
    data = sysrepocfg_fetch(NEMEA_SR_PREFIX)
    if data is None:
        return []

    base_key = '{}:supervisor'.format(NEMEA_SR_PREFIX)
    return data[base_key]['available-module']


def nemea_module_create(data):
    base_key = '{}:supervisor'.format(NEMEA_SR_PREFIX)
    json_data = {base_key: {'available-module': [data]}}

    sysrepocfg_merge(NEMEA_SR_PREFIX, json_data, 'running')
    sysrepocfg_sync_ds(NEMEA_SR_PREFIX, 'running', 'startup')


def nemea_module_delete(nmod):
    insts = i_model.get_instances()
    for inst in insts:
        i_model.delete_instance(inst, nmod)

    xpath = "/{}:supervisor/available-module[name='{}']".format(NEMEA_SR_PREFIX, nmod['name'])
    sysrepocfg_delete(NEMEA_SR_PREFIX, xpath, 'running')
    sysrepocfg_sync_ds(NEMEA_SR_PREFIX, 'running', 'startup')
