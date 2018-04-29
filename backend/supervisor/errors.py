"""
Exception classes used in Supervisor API and handled in controllers/__init__.py
"""
from liberouterapi.error import ApiException


class SysrepoError(Exception):
    def __init__(self, message):
        ApiException.__init__(self, message, status_code=500)


class InternalError(ApiException):
    def __init__(self, message):
        ApiException.__init__(self, message, status_code=500)


class SysrepocfgException(ApiException):
    def __init__(self, message):
        ApiException.__init__(self, message, status_code=500)


class YanglintException(Exception):
    def __init__(self, message):
        ApiException.__init__(self, message, status_code=500)


class NotFoundException(ApiException):
    def __init__(self, message):
        ApiException.__init__(self, message, status_code=404)


class InvalidRequest(Exception):
    def __init__(self, message):
        ApiException.__init__(self, message, status_code=400)

