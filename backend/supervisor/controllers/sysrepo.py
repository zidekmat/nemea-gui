from liberouterapi.modules.nemea.supervisor.controllers.helpers import *
from liberouterapi.modules.nemea.supervisor.models import sysrepo as sr_model


@auth.required(Role.admin)
def api_get_all_sysrepo_modules():
    """
    Returns all Sysrepo module names
    """
    return json_resp(sr_model.get_modules_names())


@auth.required(Role.admin)
def api_get_sysrepo_module_by_name(sysrepo_module_name):
    """
    Returns single Sysrepo module
    """

    module_type = request.args.get('sysrepo_module_type')
    module = sr_model.get_module_by_name(sysrepo_module_name, module_type)

    resp = {'name': sysrepo_module_name}
    resp.update(module)

    return json_resp(resp)


@auth.required(Role.admin)
def api_sysrepo_load_json(sysrepo_module_name):
    """
    Inserts new or updates existing data in Sysrepo
    """

    data = request.get_json()
    sr_model.direct_insert(sysrepo_module_name, data)

    return '', 200
