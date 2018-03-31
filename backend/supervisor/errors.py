class InvalidContentType(Exception):
    def __init__(self):
        Exception.__init__(self, 'Invalid content type, add HTTP'
                                 ' header "Content-Type: application/json".')

class NotFoundError(Exception):
    pass

class SupervisorNotRunninError(Exception):
    pass

