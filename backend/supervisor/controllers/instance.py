from liberouterapi.modules.nemea.supervisor.controllers.helpers import *
from liberouterapi.modules.nemea.supervisor.models import nemea_module as nm_model
from liberouterapi.modules.nemea.supervisor.models import instance as i_model


@auth.required(Role.admin)
def api_get_all_instances():
    """
    Returns all instances, running or not
    """

    return json_resp(list(map(instance_to_jobj, i_model.get_all())))


@auth.required(Role.admin)
def api_get_instance_by_name(instance_name):
    """
    Returns single instance, running or not
    """

    inst = i_model.get_by_name(instance_name)
    return json_resp(instance_to_jobj(inst))


@auth.required(Role.admin)
def api_create_new_instance():
    """
    Creates new instance
    """

    inst_data = request.get_json()
    i_model.create(instance_from_jobj(inst_data))

    return '', 201


@auth.required(Role.admin)
def api_delete_instance_by_name(instance_name):
    """
    Deletes instance by name if it exists
    """

    # validate whether instance with this name really exists or raise NotFoundException
    inst = i_model.get_by_name(instance_name)
    nmod = nm_model.get_by_name(inst['module-ref'])
    i_model.delete(inst, nmod)

    return '', 204


@auth.required(Role.admin)
def api_update_instance_by_name(instance_name):
    """
    Updates instance if it exists.
    Yang doesn't allow to change name of list key so first we delete the instance
    and then create a new one.
    """

    # Validate that instance to be updated really exists by fetching it's details
    inst = i_model.get_by_name(instance_name)

    data = request.get_json()
    if 'module-ref' not in data:
        raise InvalidRequest("Key 'module-ref' is missing.")
    nmod = nm_model.get_by_name(inst['module-ref'])

    i_model.update(instance_from_jobj(inst), data, nmod)

    return '', 200


@auth.required(Role.admin)
def api_get_all_instances_stats():
    """
    Returns runtime statistics of all running instances
    """

    return json_resp(i_model.all_stats())


@auth.required(Role.admin)
def api_get_instance_stats_by_name(instance_name):
    """
    Returns runtime statistics of single running instance
    """

    return json_resp(i_model.stats_by_name(instance_name))


##################################################################################
# Following functions are not API endpoints, just helpers for this file

def instance_to_jobj(inst):
    """
    Convert sysrepo instance to object structured for GUI
    """
    if 'use-sysrepo' in inst and inst['use-sysrepo']:
        inst['custom-attributes'] = i_model.get_custom_attrs(inst)
    return inst


def instance_from_jobj(inst):
    """
    Convert from object structured for GUI to sysrepo object
    """

    return inst