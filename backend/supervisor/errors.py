"""
Exception classes used in Supervisor API and handled in controllers/__init__.py
"""


class InternalError(Exception):
    pass


class SysrepocfgException(Exception):
    pass


class YanglintException(Exception):
    pass


class NotFoundException(Exception):
    pass


class InvalidRequest(Exception):
    pass

