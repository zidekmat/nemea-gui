from liberouterapi.modules.nemea.supervisor.controllers.helpers import *


@auth.required(Role.admin)
def validate(validation):  # noqa: E501
    """Validates values from given XPATH against given Sysrepo model

    Validation is done using data-lint # noqa: E501

    :param validation: Sysrepo module against which the validation is performed
    :type validation: dict | bytes

    :rtype: None
    """
    
    return 'do some magic!'
