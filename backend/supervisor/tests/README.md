### How-to ###
Tests don't need NEMEA Supervisor running but still require it's dependencies (sysrepo). Also since this nemea Liberouter module uses MongoDB you should have it running even though Supervisor API doesn't use it.

If you have all prerequisites you can run tests using `bash ./run_tests.sh`.

#### About ####
 * Tests use unittest library and can be found in file `*_controller_test.py`.
 * `stats_provider.c` is used to provide some dummy data as supervisor would
 * `subscriber.py` is used so to create some subscriptions to running datastores of sysrepo models used for tests