from liberouterapi import app
from flask import jsonify
from ..errors import *


def error_handler(error, status):
    response = jsonify({'message': str(error)})
    response.status_code = status
    return response


@app.errorhandler(SysrepoError)
def handle_sysrepo_error(error):
    return error_handler(error, 500)


@app.errorhandler(SysrepocfgException)
def handle_sysrepocfg_exception(error):
    return error_handler(error, 500)


@app.errorhandler(YanglintException)
def handle_sysrepocfg_exception(error):
    return error_handler(error, 500)


@app.errorhandler(InternalError)
def handle_sysrepocfg_exception(error):
    return error_handler(error, 500)


@app.errorhandler(NotFoundException)
def handle_not_found_exception(error):
    return error_handler(error, 404)


@app.errorhandler(InvalidRequest)
def handle_not_found_exception(error):
    return error_handler(error, 400)


__all__ = ['instance', 'nemea_module', 'sysrepo']
