from flask import Flask
from flask import Response
from flask import request

import pdb
import traceback
import json
from fake_supervisor_backend_instances_data import INSTANCES
from fake_supervisor_backend_modules_data import MODULES
from random import random
from time import sleep

app = Flask(__name__)
app.config['APPLICATION_ROOT'] = '/nemea/nemea-supervisor'

SIMPLE_MODULES = []

@app.route("/authorization", methods=['GET','POST'])
def authorize():
  if request.method == 'GET':
    return Response({}, mimetype='application/json')
  else:
    j = {"session_id": "74da7bae-0d85-11e8-b262-0800277f05b0", "user": {"id": 1, "username": "admin", "first_name": None, "last_name": None, "email": None, "role": 0, "settings": {"nemea": {"dashboard": [{"title": "Untitled Dashboard", "offset": 0, "boxes": []}]}}, "provider": "db"}}
    return Response(json.dumps(j), mimetype='application/json')

@app.errorhandler(Exception)
def all_exception_handler(error):
  return Response(json.dumps({'errors':[traceback.format_exc()]}), 500, mimetype='application/json')

####################################################################

@app.route("/nemea/sg/modules/<string:module>", methods=['GET', 'PUT', 'DELETE'])
def module_rud(module):
  if request.method == 'GET':
    for m in MODULES:
      if m['name'] == request.view_args['module']:
        return Response(json.dumps(m), mimetype='application/json')
    return ('', 404)

  elif request.method == 'PUT':
    for idx, m in enumerate(MODULES):
      if m['name'] == request.view_args['module']:
        m = request.get_json()
        SIMPLE_MODULES[idx] = m
        return ('', 200)
    return ('', 404)

  elif request.method == 'DELETE':
    for idx, i in enumerate(MODULES):
      if i['name'] == request.view_args['module']:
        del MODULES[idx]
        del SIMPLE_MODULES[idx]
        return ('', 200)
    return ('', 404)

  else:
    return ('', 400)

@app.route("/nemea/sg/modules", methods=['GET', 'POST'])
def module_create_and_all():
  if request.method == 'GET':
    withInstances = request.args.get('withInstances')
    print(withInstances)
    if withInstances == True:
      return Response(json.dumps(MODULES), mimetype='application/json')
    else:
      return Response(json.dumps(SIMPLE_MODULES), mimetype='application/json')

  else:
    m = request.get_json()
    if all (k in m for k in ('name', 'description', 'in_ifces_cnt')):
      MODULES.append(m)
      SIMPLE_MODULES.append(m)
      return ('', 201)
    else:
      return Response(json.dumps({'errors': ['some keys are missing in json']}), 400, mimetype='application/json')

####################################################################

@app.route("/nemea/sg/instances/<string:inst>/control", methods=['POST'])
def instance_control(inst):
  instName = request.view_args['inst']
  inst = None
  req = request.get_json()
  print(req)
  for i in INSTANCES:
    if i['name'] == instName:
      inst = i
      break
  if inst == None:
    return Response(json.dumps({errors:['Instance not found']}), 404, mimetype='application/json')

  if req['command'] == 'start':
    inst['running'] = True
    return ('', 200)
  elif req['command'] == 'stop':
    inst['running'] = False
    return ('', 200)
  elif req['command'] == 'restart':
    inst['running'] = True
    sleep(1.7)
    return ('', 200)
  else:
    return Response(json.dumps({errors:['Invalid or missing \'command\' key']}), 400, mimetype='application/json')

@app.route("/nemea/sg/instances/<string:inst>", methods=['GET', 'PUT', 'DELETE'])
def instance_rud(inst):
  if request.method == 'GET':
    for m in INSTANCES:
      if m['name'] == request.view_args['inst']:
        return Response(json.dumps(m), mimetype='application/json')
    return ('', 404)

  elif request.method == 'PUT':
    for m in INSTANCES:
      if m['name'] == request.view_args['inst']:
        m = request.get_json()
        return ('', 200)
    return ('', 404)

  elif request.method == 'DELETE':
    for idx, i in enumerate(INSTANCES):
      if i['name'] == request.view_args['inst']:
        del INSTANCES[idx]
        return ('', 200)
    return ('', 404)

  else:
    return ('', 400)

@app.route("/nemea/sg/instances", methods=['GET', 'POST'])
def instance_create_and_get_all():
  if request.method == 'GET':
    return Response(json.dumps(INSTANCES), mimetype='application/json')

  else:
    m = request.get_json()
    if all (k in m for k in ('name', 'module')):
      INSTANCES.append(m)
      return ('', 201)
    else:
      return Response(json.dumps({'errors': ['some keys are missing in json']}), 400, mimetype='application/json')

####################################################################
@app.route("/nemea/sg/yang-lint", methods=['POST'])
def yang_lint():
  req = request.get_json()
  # {model: '', data: {}}
  if random() < 0.1:
    return Response(json.dumps({'valid':False, 'errors': 'You have errors because of bad luck'}), mimetype='application/json')
  else:
    return Response(json.dumps({'valid':True}), mimetype='application/json')



####################################################################
if __name__ == '__main__':
  cnt = int(round(len(INSTANCES) / len(MODULES), 0))
  ii = 0
  for idx, mod in enumerate(MODULES):
    mod['instances'] += INSTANCES[ii:ii+cnt]
    for inst in INSTANCES[ii:ii+cnt]:
      inst['module'] = {'name':mod['name']}
    ii += cnt

  MODULES[-1]['instances'] += INSTANCES[ii:len(INSTANCES)]
  for inst in INSTANCES[ii:len(INSTANCES)]:
    inst['module'] = {'name':mod['name']}
    if 'in_ifces' not in inst:
      inst['in_ifces'] = []
    if 'out_ifces' not in inst:
      inst['out_ifces'] = []

  SIMPLE_MODULES = MODULES[:]
  SIMPLE_MODULES = list(map(lambda x: {y: x[y] for y in x if y != 'instances'}, SIMPLE_MODULES))



  app.run(host='127.0.0.1', port=5555)
