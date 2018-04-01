from .helpers import *
from liberouterapi.modules.nemea.supervisor.models import nemea_module as nm_model


def get_modules_names():
    names = set()
    names.add(NEMEA_SR_PREFIX)
    for nemea_module in nm_model.get_all():
        if 'sr-model-prefix' in nemea_module:
            names.add(nemea_module['sr-model-prefix'])

    return list(names)


def get_module_by_name(name, model_type=None):
    modules = get_modules_names()
    if name not in modules:
        raise NotFoundException("Module '{}' is not installed in sysrepo.".format(name))

    if model_type not in [None, 'YIN', 'YANG', 'TREE']:
        raise InvalidRequest("Invalid model type '{}'".format(model_type))

    module = yanglint_get_sr_module(name)

    if model_type is not None:
        return {model_type: module[model_type]}

    return module


def direct_insert(sysrepo_module_name, data):
    available_models = get_modules_names()
    if sysrepo_module_name not in available_models:
        raise InvalidRequest("Sysrepo module '{}' was not found in list of modules this API has access to.")
    sysrepocfg_merge(sysrepo_module_name, data)

