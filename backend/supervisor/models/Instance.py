from liberouterapi.modules.nemea.supervisor.models.helpers import *


class SkippedValueException(Exception):
    pass


def get_val_data(val):
    sr_types = [
        'SR_BOOL_T', 'SR_DECIMAL64_T', 'SR_INT8_T', 'SR_INT16_T',
        'SR_INT32_T', 'SR_INT64_T', 'SR_STRING_T', 'SR_UINT8_T',
        'SR_UINT16_T', 'SR_UINT32_T', 'SR_UINT64_T', 'SR_ENUM_T'
    ]

    val_type = val.type()

    # get value from regular value type defined in sr_types
    for sr_type in sr_types:
        if val_type == getattr(sr, sr_type):
            # eg. get_uint32
            fn_name = 'get_' + sr_type.lower()[3:-2]
            fn = getattr(val.data(), fn_name)
            return fn()

    sr_types_to_skip = [
        'SR_LIST_T', 'SR_CONTAINER_T'
    ]

    for sr_type in sr_types_to_skip:
        if val_type == getattr(sr, sr_type):
            raise SkippedValueException

    # It's not one of regular types, just get the string representation
    return str(val.data().get_string())


def vals_to_dict(vals):
    for i in range(0, vals.val_cnt()):
        print(vals.val(i).xpath())

    d = {}
    for i in range(0, vals.val_cnt()):
        val = vals.val(i)
        try:
            val_data = get_val_data(val)
        except SkippedValueException:
            continue

        # skipping first since first key would be empty
        keys = val.xpath().split('/')[1:]
        level = d
        for key in keys[0:-1]:
            if key not in level:
                level[key] = {}
            level = level[key]
        last_key = keys[-1]
        level[last_key] = val_data

    return d


class Instance:

    base_path = '/{}:supervisor'.format(NEMEA_SR_PREFIX)

    def __init__(self, name):
        self.base_path = "/{}:supervisor/module[name='{}']".format(
            NEMEA_SR_PREFIX, self.name
        )

    @classmethod
    def from_sr_val(cls, val):

        set_trace()


    @classmethod
    def find_by_name(cls, name):
        return Instance()

    @classmethod
    def from_json(cls, data):
        return Instance()

    @classmethod
    def delete_by_name(cls, name):
        return False

    @classmethod
    def all(cls, sess):
        data = sysrepocfg_fetch(NEMEA_SR_PREFIX)
        return data['%s:supervisor' % NEMEA_SR_PREFIX]['module']
        set_trace()
        return []

    @classmethod
    def all_stats(cls):
        return []

    @classmethod
    def stats_by_inst_name(cls, name):
        return {}

    def save(self):
        return False

    def update(self):
        return False

    def as_json(self):
        return json.dumps(self.__dict__)
