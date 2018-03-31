### Functions
 * sr_connect
 * sr_strerror
 * sr_session_start
 * sr_get_last_error
 * sr_get_last_errors
 * sr_get_items
 * sr_set_item
 * sr_commit
 * sr_delete_item
 * sr_session_stop
 * sr_disconnect
 

### Structs
 * sr_conn_ctx_t
 * pthread_mutex_t
 * sr_session_list_t
 * sr_session_ctx_t
 * sr_error_info_t - required
 * sr_val_t - required
 * sr_mem_ctx_t
 * sr_llist_node_t
 * sr_llist_s
 
### Enums
 * sr_conn_options_e
 * sr_error_e
 * sr_datastore_e
 * sr_sess_options_e
 * sr_data_e - required
 * sr_type_e - required
 * sr_edit_options_e
 
 
sr_get_items # works even for stats
sr_set_item
commit
sr_delete_item
sr_list_schemas --- staci sysrepoctl -l
sr_get_schema --- staci yanglint -f (tree|yang|yin) /etc/sysrepo/yang/nemea-test-1@2018-01-17.yang
adresar se ziska z sysrepoctl -l




sr_connect
 sr_conn_options_t, sr_conn_ctx_t, pthread_mutex_t, sr_session_list_s, sr_session_ctx_t, sr_error_info_t,  sr_error_e
sr_strerror
sr_session_start
 sr_datastore_t, sr_sess_options_t, 
sr_get_last_error # after get_item, get_items, sr_delete_item
sr_get_last_errors # after sr_commit (can have multiple errors)
sr_get_items
 sr_val_t, sr_mem_ctx_t, sr_llist_node_t, sr_llist_s, sr_data_t, sr_type_t
sr_set_item
 sr_edit_options_t
sr_delete_item
sr_commit
sr_session_stop
sr_disconnect