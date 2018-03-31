from liberouterapi.modules.nemea.supervisor.controllers.helpers import *


@auth.required(Role.admin)
def get_all_sysrepo_modules():
    """Returns all Sysrepo module names

    WARNING!!! Returns only names, not the whole module string # noqa: E501


    :rtype: List[str]
    """
    return 'do some magic!'


@auth.required(Role.admin)
def get_sysrepo_module_by_name(sysrepo_module_name, sysrepo_module_type=None):
    """Returns single Sysrepo module

     # noqa: E501

    :param sysrepo_module_name: Name of the Sysrepo module to return
    :type sysrepo_module_name: str
    :param sysrepo_module_type: Type of representation of Sysrepo module. If used, only this type is returned is returned in response
    :type sysrepo_module_type: str

    :rtype: List[InlineResponse200]
    """
    return 'do some magic!'

@auth.required(Role.admin)
def sysrepo_load_json(sysrepo_module_name, sysrepoModuleJsonData):
    """Inserts new or updates existing data in Sysrepo

    Inserts new or updates existing data of NEMEA Module, NEMEA Instance or custom NEMEA Instance inside Sysrepo. Accepts JSON that will be directly loaded into Sysrepo # noqa: E501

    :param sysrepo_module_name: Name of Sysrepo model where the data would be loaded to.
    :type sysrepo_module_name: str
    :param sysrepoModuleJsonData: JSON of Sysrepo module data
    :type sysrepoModuleJsonData:

    :rtype: None
    """
    return 'do some magic!'
