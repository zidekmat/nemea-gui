from liberouterapi.modules.nemea.supervisor.controllers.helpers import *
from liberouterapi.modules.nemea.supervisor.models import nemea_module as nm_model
from liberouterapi.modules.nemea.supervisor.models import instance as i_model

@auth.required(Role.admin)
def api_create_new_nemea_module():
    """
    Creates new NEMEA module
    """

    data = request.get_json()
    nm_model.create(data)

    return '', 201


@auth.required(Role.admin)
def api_delete_nemea_module_by_name(module_name):
    """
    Deletes available module by name but also all of its instances with their custom
    models
    """

    # verify it exists by fetching it
    nmod = nm_model.get_by_name(module_name)
    nm_model.delete(nmod)

    return '', 204


@auth.required(Role.admin)
def api_get_all_nemea_modules():
    """
    Returns all available NEMEA modules
    """

    return json_resp(nm_model.get_all())


@auth.required(Role.admin)
def api_get_instances_by_nemea_module_name(module_name):
    """
    Returns instances of given NEMEA module
    """

    # verify that module exists
    nm_model.get_by_name(module_name)

    insts = i_model.get_by_nemea_module_name(module_name)

    return json_resp(insts)


@auth.required(Role.admin)
def api_get_nemea_module_by_name(module_name):
    """
    Returns available module by name
    """

    nmod = nm_model.get_by_name(module_name)
    return json_resp(nmod)


@auth.required(Role.admin)
def api_update_nemea_module_by_name(module_name):
    """
    Updates available module
    """

    # Validate that NEMEA module to be updated really exists by fetching it's details
    nmod = nm_model.get_by_name(module_name)

    update_data = request.get_json()
    nm_model.update(nmod, update_data)

    return '', 200

##################################################################################
# Following functions are not API endpoints, just helpers for this file


