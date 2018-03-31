from liberouterapi.modules.nemea.supervisor.controllers.helpers import *


@auth.required(Role.admin)
def create_new_nemea_module(module):
    """Creates new NEMEA module

     # noqa: E501

    :param module: Module to create
    :type module: dict | bytes

    :rtype: object
    """
    # find whether module already exists
    # sr_get_items /{}:supervisor/module[name='{}']
    # sr_set_item /{}:supervisor/module[name='{}']

    # Module.find_by_name(module['name'])
    # Module.new(module)
    # Module.save()
    return 'do some magic!'


@auth.required(Role.admin)
def delete_nemea_module_by_name(module_name):
    """Deletes available module by name

     # noqa: E501

    :param module_name: Name of the module to return
    :type module_name: str

    :rtype: None
    """
    # sr_delete_item /{}:supervisor/module[name='{}']

    # Module.delete_by_name(module_name)
    return 'do some magic!'


@auth.required(Role.admin)
def get_all_nemea_modules():
    """Returns all available NEMEA modules

     # noqa: E501


    :rtype: List[Module]
    """
    # sr_get_items /{}:supervisor/module/*

    # Module.all()
    return 'do some magic!'


@auth.required(Role.admin)
def get_instances_by_nemea_module_name(module_name):
    """Returns instances of given NEMEA module

     # noqa: E501

    :param module_name: Name of the module whose instances should be returned
    :type module_name: str

    :rtype: object
    """
    # sr_get_items /{}:supervisor/instance/module-kind
    # sr_get_items /{}:supervisor/instance[name='{}']/*
    # sr_get_items /{}:supervisor/instance[name='{}']/*
    # sr_get_items /{}:supervisor/instance[name='{}']/*

    # m = Module.find_by_name(module_name)
    # insts = Instance.find_by_module(m.name)
    # map(insts, serialize)
    return 'do some magic!'


@auth.required(Role.admin)
def get_nemea_module_by_name(module_name):
    """Returns available module by name

     # noqa: E501

    :param module_name: Name of the module to return
    :type module_name: str

    :rtype: object
    """
    # sr_get_items /{}:supervisor/module[name='{}']

    # m = Module.find_by_name(module_name)
    return 'do some magic!'


@auth.required(Role.admin)
def update_nemea_module_by_name(module_name, module):
    """Updates available module

     # noqa: E501

    :param module_name: Name of the module to return
    :type module_name: str
    :param module: Module to update
    :type module: dict | bytes

    :rtype: None
    """
    # find whether module already exists
    # sr_get_items /{}:supervisor/module[name='{}']
    # sr_set_item /{}:supervisor/module[name='{}']

    # m = Module.find_by_name(module_name)
    # m.update(module)
    
    return 'do some magic!'
