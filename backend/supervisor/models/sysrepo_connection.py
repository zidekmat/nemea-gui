from liberouterapi.modules.nemea.supervisor.models.helpers import *


def sysrepo_connection(fn):
    def wrapper(*args, **kwargs):
        conn = sr.Connection(fn.__name__)
        if conn is None:
            raise Exception('Failed to connect to sysrepo')

        sess = sr.Session(conn, USED_SR_DATASTORE)
        if sess is None:
            raise Exception('Failed to create sysrepo session')

        args = (sess,) + args
        fn(*args, **kwargs)

    # Rename wrapper function name to fn function name so that Flask won't complain
    # It's just modified to work in Python3, hence change of func_name to __name__
    # kudos to https://stackoverflow.com/questions/17256602/assertionerror-view-function-mapping-is-overwriting-an-existing-endpoint-functi
    wrapper.__name__ = fn.__name__

    return wrapper
