from liberouterapi import app, config
from liberouterapi.dbConnector import dbConnector
from liberouterapi.modules.module import Module

# Load NEMEA configuration file if nemea section is not present in current config
if "nemea" not in config.config.sections():
    config.load(path = __path__[0] + '/config.ini')
    conf_path = config['nemea']

# We need collection for NEMEA Events and Dashboard to be set up
nemea_conn = dbConnector("nemea",
        provider = "mongodb",
        config = {
            'database' : config['nemea']['database']
            })

nemea = nemea_conn.db[config['nemea']['collection']]

# Register a blueprint
nemea_bp = Module('nemea', __name__, url_prefix='/nemea', no_version=True)

from .events import *
from .Query import query
from .Stats import aggregate, top, count
from .Reporters import *
from .Status import *
from .supervisor.controllers import *

# Create index for DetectTime
nemea_bp.add_url_rule('/indexes', view_func=indexes, methods=['GET'])

# Get last N events
nemea_bp.add_url_rule('/events/<int:items>', view_func=get_last_events, methods=['GET'])

# Create a query based on GET params
nemea_bp.add_url_rule('/events/query', view_func=query, methods=['GET'])

# Aggregate stats about recent events specified by time range
nemea_bp.add_url_rule('/events/aggregate', view_func=aggregate, methods=['GET'])

# Get TOP events from each category
nemea_bp.add_url_rule('/events/top', view_func=top, methods=['GET'])

# Count events in given time window
nemea_bp.add_url_rule('/events/count', view_func=count, methods=['GET'])

# Get an event by its ID
nemea_bp.add_url_rule('/events/id/<string:id>', view_func=get_by_id, methods=['GET'])

# Whois lookup (unused)
nemea_bp.add_url_rule('/whois/<string:ip>', view_func=whois, methods=['GET'])

nemea_bp.add_url_rule('/reporters/config', view_func=get_nr_config, methods=['GET'])
nemea_bp.add_url_rule('/reporters/config', view_func=edit_nr_config, methods=['PUT'])

nemea_bp.add_url_rule('/status', view_func=nemea_main, methods=['GET'])
nemea_bp.add_url_rule('/status/stats', view_func=nemea_events, methods=['GET'])


# Supervisor API
nemea_bp.add_url_rule('/modules/<string:module_name>',
                      view_func=nemea_module.api_get_nemea_module_by_name,
                      methods=['GET'])
nemea_bp.add_url_rule('/modules/<string:module_name>',
                      view_func=nemea_module.api_update_nemea_module_by_name,
                      methods=['PUT'])
nemea_bp.add_url_rule('/modules/<string:module_name>',
                      view_func=nemea_module.api_delete_nemea_module_by_name,
                      methods=['DELETE'])
nemea_bp.add_url_rule('/modules',
                      view_func=nemea_module.api_create_new_nemea_module,
                      methods=['POST'])
nemea_bp.add_url_rule('/modules',
                      view_func=nemea_module.api_get_all_nemea_modules,
                      methods=['GET'])
nemea_bp.add_url_rule('/modules/<string:module_name>/instances',
                      view_func=nemea_module.api_get_instances_by_nemea_module_name,
                      methods=['GET'])
nemea_bp.add_url_rule('/instances/<string:instance_name>',
                      view_func=instance.api_get_instance_by_name,
                      methods=['GET'])
nemea_bp.add_url_rule('/instances/<string:instance_name>',
                      view_func=instance.api_update_instance_by_name,
                      methods=['PUT'])
nemea_bp.add_url_rule('/instances/<string:instance_name>',
                      view_func=instance.api_delete_instance_by_name,
                      methods=['DELETE'])
nemea_bp.add_url_rule('/instances/<string:instance_name>/stats',
                      view_func=instance.api_get_instance_stats_by_name,
                      methods=['GET'])
nemea_bp.add_url_rule('/instances',
                      view_func=instance.api_get_all_instances,
                      methods=['GET'])
nemea_bp.add_url_rule('/instances',
                      view_func=instance.api_create_new_instance,
                      methods=['POST'])
nemea_bp.add_url_rule('/instances/<string:instance_name>/<string:action>',
                      view_func=instance.api_control_instance,
                      methods=['POST'])
nemea_bp.add_url_rule('/instances/stats',
                      view_func=instance.api_get_all_instances_stats,
                      methods=['GET'])
nemea_bp.add_url_rule('/sysrepo/modules',
                      view_func=sysrepo.api_get_all_sysrepo_modules,
                      methods=['GET'])
nemea_bp.add_url_rule('/sysrepo/modules/<string:sysrepo_module_name>',
                      view_func=sysrepo.api_get_sysrepo_module_by_name,
                      methods=['GET'])
nemea_bp.add_url_rule('/sysrepo/load/<string:sysrepo_module_name>',
                      view_func=sysrepo.api_sysrepo_load_json,
                      methods=['POST'])
