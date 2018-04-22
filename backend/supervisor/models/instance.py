from .helpers import *
from . import nemea_module as nm_model


def get_all():
    data = sysrepocfg_fetch(NEMEA_SR_PREFIX)
    if data is None:
        return []

    base_key = '{}:supervisor'.format(NEMEA_SR_PREFIX)
    insts = data[base_key]['instance']

    sess = sr_get_session()
    try:
        for inst in insts:
            inst['running'] = get_running_status(inst['name'], sess)
    finally:
        sess.session_stop()

    return insts


def get_custom_attrs(inst):
    nmod = nm_model.get_by_name(inst['module-ref'])

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


def get_by_name(instance_name):
    data = sysrepocfg_fetch(NEMEA_SR_PREFIX)
    if data is None:
        raise NotFoundException("No configuration data found.")

    insts = data['{}:supervisor'.format(NEMEA_SR_PREFIX)]['instance']
    for stored_inst in insts:
        if stored_inst['name'] == instance_name:
            stored_inst['running'] = get_running_status(instance_name)
            return stored_inst

    raise NotFoundException("Instance '%s' was not found." % instance_name)


def get_running_status(instance_name, p_sess=None):
    if p_sess is None:
        sess = sr_get_session()
    else:
        sess = p_sess

    xpath = "/nemea:supervisor/instance[name='%s']/stats/running" % instance_name
    val = sess.get_item(xpath)

    if p_sess is None:
        sess.session_stop()

    if val is None:
        return False

    if val.data() is None:
        return False

    return val.data().get_bool()


def get_by_nemea_module_name(module_name):
    sess = sr_get_session()
    try:
        stored_insts = get_all()
        insts = []
        for inst in stored_insts:
            if inst['module-ref'] == module_name:
                inst['running'] = get_running_status(inst['name'], sess)
                insts.append(inst)
    finally:
        sess.session_stop()

    return insts


def get_custom_attrs_obj_by_name(inst_name, nemea_module=None):
    if nemea_module is None:
        inst = nm_model.get_by_name(inst_name)
        nemea_module = nm_model.get_by_name(inst['module-ref'])
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


def delete(inst, nmod=None):
    if nmod is None:
        nmod = nm_model.get_by_name(inst['module-ref'])

    # delete custom model first
    if nmod['is-sysrepo-ready']:
        xpath = "/{}:instance[name='{}']".format(nmod['sr-model-prefix'], inst['name'])
        sysrepocfg_delete(nmod['sr-model-prefix'], xpath, 'running')
        sysrepocfg_sync_ds(nmod['sr-model-prefix'], 'running', 'startup')

    xpath = "/{}:supervisor/instance[name='{}']".format(NEMEA_SR_PREFIX, inst['name'])
    sysrepocfg_delete(NEMEA_SR_PREFIX, xpath, 'running')
    sysrepocfg_sync_ds(NEMEA_SR_PREFIX, 'running', 'startup')


def update_with_name_change(old_name, sup_update_data, do_update_custom_attrs, sr_model, custom_update_data):
    """
    First try to delete and update in startup datastore to see whether update fails.
    Because invalid data could be supplied to update and the transaction (delete+update)
    would fail. It is easier to recover from this error from startup datastore because
    supervisor doesn't care about changes there.
    """
    try:
        # delete the old instance
        xpath = "/{}:supervisor/instance[name='{}']".format(NEMEA_SR_PREFIX,
                                                          old_name)
        sysrepocfg_delete(NEMEA_SR_PREFIX, xpath, 'startup')

        # create the new one
        sysrepocfg_merge(NEMEA_SR_PREFIX, sup_update_data, 'startup')
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
            try:
                # delete the old instance from startup configuration
                xpath = "/{}:instance[name='{}']".format(sr_model, old_name)
                sysrepocfg_delete(sr_model, xpath, 'startup')

                sysrepocfg_merge(sr_model, custom_update_data, 'startup')
            except:
                # recover from failed transaction by copying unchanged running
                # datastore to startup
                sysrepocfg_sync_ds(sr_model, 'running', 'startup')
                raise

    # transaction was success, sync startup to running. this should not fail
    sysrepocfg_sync_ds(NEMEA_SR_PREFIX, 'startup', 'running')
    if do_update_custom_attrs:
        sysrepocfg_sync_ds(sr_model, 'startup', 'running')


def update(inst, data, nmod):
    """
    Yang doesn't allow to change name of list key so first we delete the instance
    and then create a new one.

    :param dict inst: Dictionary of instance to be updated
    :param dict data: Dictionary data that should be instance updated with
    :param dict nmod: NEMEA module of instance after update
    """
    if 'name' not in data:
        raise InvalidRequest("Key 'name' is missing.")

    if data['name'] == 'stats':
        raise InvalidRequest(
            "Instance cannot be named 'stats' it's reserved keyword.")

    if 'interface' in data and isinstance(data['interface'], list):
        if len(data['interface']) == 0:
            del data['interface']

    # helper var to know we have every value needed to update custom-attributes
    do_update_custom_attrs = 'is-sysrepo-ready' in nmod and nmod['is-sysrepo-ready'] \
                             and 'custom-attributes' in data

    sr_model = None
    custom_update_data = None
    # get custom attributes to separate variable
    if do_update_custom_attrs:
        custom_attrs = data['custom-attributes']
        # delete because otherwise merge to supervisor's data model would fail
        del data['custom-attributes']
        custom_attrs.update({"name": data['name']})

        # prepare update data for custom model
        sr_model = nmod['sr-model-prefix']
        base_key = '{}:instance'.format(sr_model)
        custom_update_data = {base_key: [custom_attrs]}

    # prepare update data for NEMEA supervisor model
    base_key = '{}:supervisor'.format(NEMEA_SR_PREFIX)
    sup_update_data = {
        base_key: {
            'instance': [data]
        }
    }


    if inst['name'] != data['name']:
        # verify that new name doesn't exist
        validate_instance_name_doesnt_exist(data['name'], nmod)
    update_with_name_change(inst['name'], sup_update_data, do_update_custom_attrs,
                            sr_model, custom_update_data)


def create(inst_data):
    if 'name' not in inst_data:
        raise InvalidRequest("Key 'name' is missing.")
    if inst_data['name'] == 'stats':
        raise InvalidRequest("Instance cannot be named 'stats' it's reserved keyword.")

    if 'module-ref' not in inst_data:
        raise InvalidRequest("Key 'module-ref' is missing")

    if 'interface' in inst_data and isinstance(inst_data['interface'], list):
        if len(inst_data['interface']) == 0:
            del inst_data['interface']

    nmod = nm_model.get_by_name(inst_data['module-ref'])
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
    inst_data = {base_key: {'instance': [inst_data]}}

    sysrepocfg_merge(NEMEA_SR_PREFIX, inst_data, 'running')
    sysrepocfg_sync_ds(NEMEA_SR_PREFIX, 'running', 'startup')


def start(instance_name):
    # verify instance exists
    get_by_name(instance_name)
    xpath = "/{}:supervisor/instance[name='{}']/enabled".format(NEMEA_SR_PREFIX,
                                                                instance_name)
    sysrepocfg_set_by_xpath(NEMEA_SR_PREFIX, xpath, 'true', 'running')

    return '', 200


def stop(instance_name):
    # verify instance exists
    get_by_name(instance_name)
    xpath = "/{}:supervisor/instance[name='{}']/enabled".format(NEMEA_SR_PREFIX,
                                                                instance_name)
    sysrepocfg_set_by_xpath(NEMEA_SR_PREFIX, xpath, 'false', 'running')

    return '', 200


def validate_instance_name_doesnt_exist(inst_name, nmod):
    # Validate if instance with name doesn't exist in supervisor model
    try:
        get_by_name(inst_name)
        raise InvalidRequest(
            "Instance '%s' already exists in supervisor's configuration." %
            inst_name)
    except NotFoundException:
        pass

    # Validate if instance with name doesn't exist in custom model
    if nmod['is-sysrepo-ready']:
        try:
            get_custom_attrs_obj_by_name(inst_name, nmod)
            raise InvalidRequest(
                "Instance '%s' already exists in '%s' model configuration." % (
                    inst_name, nmod['sr-model-prefix']))
        except NotFoundException:
            pass


def all_stats():
    data = sysrepocfg_get_stats()
    base_key = "%s:supervisor" % NEMEA_SR_PREFIX
    return data[base_key]['instance']


def stats_by_name(instance_name):
    data = sysrepocfg_get_stats()
    base_key = "%s:supervisor" % NEMEA_SR_PREFIX
    for inst_stats in data[base_key]['instance']:
        if 'name' in inst_stats and inst_stats['name'] == instance_name:
            return inst_stats

    raise NotFoundException("Instance '%s' was not found." % instance_name)
