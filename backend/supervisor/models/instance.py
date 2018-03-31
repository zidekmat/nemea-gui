from .helpers import *
from . import nemea_module as nm_model


def get_instances():
    data = sysrepocfg_fetch(NEMEA_SR_PREFIX)
    if data is None:
        return []

    base_key = '{}:supervisor'.format(NEMEA_SR_PREFIX)
    return data[base_key]['module']


def get_custom_attrs(inst):
    nmod = nm_model.get_nemea_module_by_name(inst['module'])

    # search the custom model and retrieve data for this instance
    data = sysrepocfg_fetch(nmod['sr-model-prefix'])
    custom_attrs = None
    custom_instances = data['{}:instance'.format(nmod['sr-model-prefix'])]
    for stored_inst in custom_instances:
        if stored_inst['name'] == inst['name']:
            custom_attrs = stored_inst
            break

    if custom_attrs is None:
        return {}
    return custom_attrs


def get_instance_by_name(instance_name):
    data = sysrepocfg_fetch(NEMEA_SR_PREFIX)
    if data is None:
        raise NotFoundException("No configuration data found.")

    insts = data['{}:supervisor'.format(NEMEA_SR_PREFIX)]['module']
    for stored_inst in insts:
        if stored_inst['name'] == instance_name:
            return stored_inst

    raise NotFoundException("Instance '%s' was not found." % instance_name)


def get_instance_custom_attrs_obj(inst_name, nemea_module=None):
    if nemea_module is None:
        inst = nm_model.get_nemea_module_by_name(inst_name)
        nemea_module = nm_model.get_nemea_module_by_name(inst['module-kind'])
    sr_model = nemea_module['sr-model-prefix']

    data = sysrepocfg_fetch(sr_model)
    if data is None:
        raise NotFoundException("No configuration data found for model '%s'." % sr_model)

    instances_key = '%s:instance' % sr_model
    if instances_key not in data:
        raise InternalError("Sysrepo model '%s' has invalid structure. Verify installation." % sr_model)

    for inst in data[instances_key]:
        if 'name' in inst and inst['name'] == inst_name:
            return inst

    raise NotFoundException("Instance '%s' was not found in '%s' sysrepo model." % (inst_name, sr_model))


def delete_instance(inst, nmod=None):
    if nmod is None:
        nmod = nm_model.get_nemea_module_by_name(inst['module-kind'])

    # delete custom model first
    if nmod['is-sysrepo-ready']:
        xpath = "/{}:instance[name='{}']".format(nmod['sr-model-prefix'],
                                                 inst['name'])
        sysrepocfg_delete(nmod['sr-model-prefix'], xpath, 'running')
        sysrepocfg_sync_ds(nmod['sr-model-prefix'], 'running', 'startup')

    xpath = "/{}:supervisor/module[name='{}']".format(NEMEA_SR_PREFIX, inst['name'])
    sysrepocfg_delete(NEMEA_SR_PREFIX, xpath, 'running')
    sysrepocfg_sync_ds(NEMEA_SR_PREFIX, 'running', 'startup')
