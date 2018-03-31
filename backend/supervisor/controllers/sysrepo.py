from liberouterapi.modules.nemea.supervisor.controllers.helpers import *


@auth.required(Role.admin)
def get_all_sysrepo_modules():
    """Returns all Sysrepo module names

    WARNING!!! Returns only names, not the whole module string # noqa: E501


    :rtype: List[str]
    """
    # sysrepocfg -l
    # yanglint -f (tree|yang|yin) /etc/models/yang/nemea-test-1@2018-01-17.yang
    return 'do some magic!'


@auth.required(Role.admin)
def get_sysrepo_module_by_name(sysrepo_module_name):
    """Returns single Sysrepo module

     # noqa: E501

    :param sysrepo_module_name: Name of the Sysrepo module to return
    :type sysrepo_module_name: str
    :param sysrepo_module_type: Type of representation of Sysrepo module. If used, only this type is returned is returned in response
    :type sysrepo_module_type: str

    :rtype: List[InlineResponse200]
    """
    # sysrepocfg -l
    # yanglint -f (tree|yang|yin) /etc/models/yang/nemea-test-1@2018-01-17.yang
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

sysrepocfg --import=set_test.json -f json -d startup nemea-test-1
[ERR] Unable to parse the input data: Value "gsdsf" does not satisfy the constraint "^/.+" (range, length, or pattern). (/nemea-test-1:supervisor/available-module[name='ipfixcol']/path)
Errors were encountered during importing. Cancelling the operation.

sysrepocfg --import=set1.json -f json -d startup nemea-test-1
The new configuration was successfully applied.
    """
    return 'do some magic!'

"""
@auth.required(Role.admin)
def get_instance_custom_model_by_name(instance_name):
    #Returns instance's custom data model
    # validate whether instance with this name really exists or raise NotFoundException
    inst = get_instance_obj_by_name(instance_name)
    nmod = get_nemea_module_obj_by_name(inst['module-kind'])

    if not nmod['is-sysrepo-ready']:
        raise InvalidRequest('This instance is not sysrepo ready and has no custom data model.')

    model_name = nmod['sr-model-prefix']
    for existing_model in sysrepo_get_models_list():
        if model_name == existing_model:
            return json_resp(yanglint_get_model(existing_model))

    raise NotFoundException("Instance model '{}' is not installed in sysrepo!".format(model_name))
"""