from liberouterapi.modules.nemea.supervisor.controllers.helpers import *
from liberouterapi.modules.nemea.supervisor.models.Instance import Instance


@auth.required(Role.admin)
def get_all_instances():
    """
    Returns all instances, running or not
    """
    data = sysrepocfg_fetch(NEMEA_SR_PREFIX)
    if data is None:
        return json_resp([])

    base_key = '{}:supervisor'.format(NEMEA_SR_PREFIX)
    insts = data[base_key]['module']
    data = list(map(instance_to_jobj, insts))

    return json_resp(data)


@auth.required(Role.admin)
def get_instance_by_name(instance_name):
    """
    Returns single instance, running or not
    """
    inst = get_instance_obj_by_name(instance_name)
    return json_resp(instance_to_jobj(inst))


@auth.required(Role.admin)
def create_new_instance():
    """
    Creates new instance
    """
    inst_data = request.get_json()
    if 'name' not in inst_data:
        raise InvalidRequest("Key 'name' is missing.")

    if inst_data['name'] == 'stats':
        raise InvalidRequest("Instance cannot be named 'stats' it's reserved keyword.")

    if 'module-kind' not in inst_data:
        raise InvalidRequest("Key 'module-kind' is missing")

    nmod = get_nemea_module_obj_by_name(inst_data['module-kind'])
    validate_instance_name_doesnt_exist(inst_data, nmod)

    # helper to know we have every value needed to create instance in custom model
    do_create_custom_attrs = 'is-sysrepo-ready' in nmod and nmod['is-sysrepo-ready']\
                             and 'custom-attributes' in inst_data

    if do_create_custom_attrs:
        base_key = "{}:instance".format(nmod['sr-model-prefix'])
        custom_attrs = inst_data['custom-attributes']
        # delete because otherwise merge to supervisor's data model would fail
        del inst_data['custom-attributes']
        custom_attrs.update({"name": inst_data['name']})
        data = {
            base_key: [custom_attrs]
        }
        sysrepocfg_merge(nmod['sr-model-prefix'], data, 'running')
        sysrepocfg_sync_ds(nmod['sr-model-prefix'], 'running', 'startup')

    base_key = '{}:supervisor'.format(NEMEA_SR_PREFIX)
    inst_data = {base_key: {'module': [instance_from_jobj(inst_data)]}}

    sysrepocfg_merge(NEMEA_SR_PREFIX, inst_data, 'running')
    sysrepocfg_sync_ds(NEMEA_SR_PREFIX, 'running', 'startup')

    return '', 201


@auth.required(Role.admin)
def delete_instance_by_name(instance_name):
    """
    Deletes instance by name if it exists
    """
    # validate whether instance with this name really exists or raise NotFoundException
    inst = get_instance_obj_by_name(instance_name)
    nmod = get_nemea_module_obj_by_name(inst['module-kind'])
    if nmod['is-sysrepo-ready']:
        xpath = "/{}:instance[name='{}']".format(nmod['sr-model-prefix'], inst['name'])
        sysrepocfg_delete(nmod['sr-model-prefix'], xpath, 'running')
        sysrepocfg_sync_ds(nmod['sr-model-prefix'], 'running', 'startup')

    xpath = "/{}:supervisor/module[name='{}']".format(NEMEA_SR_PREFIX, instance_name)
    sysrepocfg_delete(NEMEA_SR_PREFIX, xpath, 'running')
    sysrepocfg_sync_ds(NEMEA_SR_PREFIX, 'running', 'startup')

    return '', 204


@auth.required(Role.admin)
def update_instance_by_name(instance_name):
    """
    Updates instance if it exists.
    Yang doesn't allow to change name of list key so first we delete the instance
    and then create a new one.
    """

    # Validate that instance to be updated really exists by fetching it's details
    stored_inst = get_instance_obj_by_name(instance_name)
    nmod = get_nemea_module_obj_by_name(stored_inst['module-kind'])

    inst_update_data = request.get_json()
    if 'name' not in inst_update_data:
        raise InvalidRequest("Key 'name' is missing.")

    if inst_update_data['name'] == 'stats':
        raise InvalidRequest("Instance cannot be named 'stats' it's reserved keyword.")

    # if it gets new name after update, verify that new name doesn't exist
    if instance_name != inst_update_data['name']:
        validate_instance_name_doesnt_exist(inst_update_data, nmod)

    # helper var to know we have every value needed to update custom-attributes
    do_update_custom_attrs = 'is-sysrepo-ready' in nmod and nmod['is-sysrepo-ready'] \
                and 'custom-attributes' in inst_update_data
    if do_update_custom_attrs:
        custom_attrs = inst_update_data['custom-attributes']
        # delete because otherwise merge to supervisor's data model would fail
        del inst_update_data['custom-attributes']
        custom_attrs.update({"name": inst_update_data['name']})

    """
    First try to delete and update in startup datastore to see whether update fails.
    Because invalid data could be supplied to update and the transaction (delete+update)
    would fail. It is easier to recover from this error from startup datastore because
    supervisor doesn't care about changes there.
    """
    try:
        # delete the instance
        xpath = "/{}:supervisor/module[name='{}']".format(NEMEA_SR_PREFIX, instance_name)
        sysrepocfg_delete(NEMEA_SR_PREFIX, xpath, 'startup')

        # create the new one
        base_key = '{}:supervisor'.format(NEMEA_SR_PREFIX)
        data = {
            base_key: {
                'module': [instance_from_jobj(inst_update_data)]
            }
        }
        sysrepocfg_merge(NEMEA_SR_PREFIX, data, 'startup')
    except:
        # recover from failed transaction by copying unchanged running datastore
        # to startup
        sysrepocfg_sync_ds(NEMEA_SR_PREFIX, 'running', 'startup')
        raise
    finally:
        """
        After an attempt to update supervisor's instance data, try to update instance's 
        custom model using custom-attributes
        """
        if do_update_custom_attrs:
            sr_model = nmod['sr-model-prefix']
            try:
                # delete the instance from startup configuration
                xpath = "/{}:instance[name='{}']".format(sr_model, instance_name)
                sysrepocfg_delete(sr_model, xpath, 'startup')

                # create updated instance in startup configuration
                base_key = '{}:instance'.format(sr_model)
                data = { base_key: [custom_attrs] }
                # sync datastores
                sysrepocfg_merge(sr_model, data, 'startup')
            except:
                # recover from failed transaction by copying unchanged running datastore
                # to startup
                sysrepocfg_sync_ds(sr_model, 'running', 'startup')
                raise

    # transaction was success, sync startup to running. this should not fail
    sysrepocfg_sync_ds(NEMEA_SR_PREFIX, 'startup', 'running')
    if do_update_custom_attrs:
        sysrepocfg_sync_ds(sr_model, 'startup', 'running')

    return '', 200


@auth.required(Role.admin)
def get_all_instances_stats():
    """
    Returns runtime statistics of all running instances
    """
    # sr_get_items /{}:supervisor/instance/stats/*
    # sr_get_items /{}:supervisor/instance/interface/stats/*

    # Instance.all_stats()
    data = sysrepocfg_get_stats()
    base_key = "%s:supervisor" % NEMEA_SR_PREFIX
    return json_resp(data[base_key]['module'])


@auth.required(Role.admin)
def get_instance_stats_by_name(instance_name):
    """
    Returns runtime statistics of single running instance
    """
    # sr_get_items /{}:supervisor/instance[name='{}']/stats/*
    # sr_get_items /{}:supervisor/instance[name='{}']/interface/stats/*

    # Instance.stats_by_inst_name(instance_name)
    data = sysrepocfg_get_stats()
    base_key = "%s:supervisor" % NEMEA_SR_PREFIX
    for inst_stats in data[base_key]['module']:
        if 'name' in inst_stats and inst_stats['name'] == instance_name:
            return json_resp(inst_stats)

    raise NotFoundException("Instance '%s' was not found." % instance_name)



def instance_to_jobj(inst):
    """
    Convert sysrepo instance to object structured for GUI
    """
    # rename 'module-kind' to 'module'
    inst['module'] = inst['module-kind']
    del inst['module-kind']
    if 'use-sysrepo' in inst and inst['use-sysrepo']:
        inst['custom-attributes'] = get_custom_attrs(inst)
    return inst


def instance_from_jobj(inst):
    """
    Convert from object structured for GUI to sysrepo object
    """
    if 'module' in inst:
        inst['module-kind'] = inst['module']
        del inst['module']

    return inst


def get_custom_attrs(inst):
    nmod = get_nemea_module_obj_by_name(inst['module'])

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


def get_instance_obj_by_name(instance_name):
    data = sysrepocfg_fetch(NEMEA_SR_PREFIX)
    if data is None:
        raise NotFoundException("No configuration data found.")

    insts = data['{}:supervisor'.format(NEMEA_SR_PREFIX)]['module']
    for stored_inst in insts:
        if stored_inst['name'] == instance_name:
            return stored_inst

    raise NotFoundException("Instance '%s' was not found." % instance_name)


def get_nemea_module_obj_by_name(nmod_name):
    data = sysrepocfg_fetch(NEMEA_SR_PREFIX)
    if data is None:
        raise NotFoundException("No configuration data found.")

    mods = data['%s:supervisor' % NEMEA_SR_PREFIX]['available-module']
    for mod in mods:
        if mod['name'] == nmod_name:
            return mod

    raise NotFoundException("Nemea module '%s' was not found in supervisor's configuration." % nmod_name)


def get_instance_custom_attrs_obj(inst_name, nemea_module=None):
    if nemea_module is None:
        inst = get_nemea_module_obj_by_name(inst_name)
        nemea_module = get_nemea_module_obj_by_name(inst['module-kind'])
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


def validate_instance_name_doesnt_exist(inst_obj, nmod):
    # Validate if instance with name doesn't exist in supervisor model
    try:
        get_instance_obj_by_name(inst_obj['name'])
        raise InvalidRequest(
            "Instance '%s' already exists in supervisor's configuration." %
            inst_obj['name'])
    except NotFoundException:
        pass

    # Validate if instance with name doesn't exist in custom model
    if nmod['is-sysrepo-ready']:
        try:
            get_instance_custom_attrs_obj(inst_obj['name'], nmod)
            raise InvalidRequest(
                "Instance '%s' already exists in '%s' model configuration." % (
                    inst_obj['name'], nmod['sr-model-prefix']))
        except NotFoundException:
            pass

