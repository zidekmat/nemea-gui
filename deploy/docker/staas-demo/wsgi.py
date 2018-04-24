# this is patched version from https://github.com/CESNET/liberouter-gui/backend/wsgi.py
# that version only worked with virtualenv

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

import sys
print(sys.version)

from liberouterapi import app as application
