from random import random
from random import choice


MODULES = [
{'path': '/a/c/b/dd/ee', 'instances': [],'in_ifces_cnt': '2', 'out_ifces_cnt': '0','enabled': True, 'name': "IPFIXCOL", 'is_nemea_mod': False, 'is_sr_ready': False, 'sr_cb_ready': False},
{'path': '/a/c/b/dd/3e', 'instances': [],'in_ifces_cnt': '3', 'out_ifces_cnt': '3','enabled': False, 'name': "IPFIXSEND", 'is_nemea_mod': False, 'is_sr_ready': False, 'sr_cb_ready': False},
{'path': '/a/c/b/dd/se', 'instances': [],'in_ifces_cnt': '1', 'out_ifces_cnt': '*','enabled': False, 'name': "vportscan_detector", 'is_nemea_mod': True, 'is_sr_ready': False, 'sr_cb_ready': False},
{'path': '/a/c/b/dd/ee', 'instances': [],'in_ifces_cnt': '0', 'out_ifces_cnt': '4','enabled': False, 'name': "link_traffic", 'is_nemea_mod': True, 'is_sr_ready': True, 'sr_cb_ready': True},
{'path': '/a/c/b/ddxee', 'instances': [],'in_ifces_cnt': '8', 'out_ifces_cnt': '1','enabled': False, 'name': "Module 5", 'is_nemea_mod': False, 'is_sr_ready': False, 'sr_cb_ready': False},
{'path': '/a/c/b/dd/ee', 'instances': [],'in_ifces_cnt': '*', 'out_ifces_cnt': '1','enabled': False, 'name': "Module 6", 'is_nemea_mod': False, 'is_sr_ready': False, 'sr_cb_ready': False},
{'path': '/a/c/b/dd ee', 'instances': [],'in_ifces_cnt': '*', 'out_ifces_cnt': '1','enabled': True, 'name': "Detector 3", 'is_nemea_mod': True, 'is_sr_ready': False, 'sr_cb_ready': False},
{'path': '/a/c/b/dd/ee', 'instances': [],'in_ifces_cnt': '*', 'out_ifces_cnt': '0','enabled': True, 'name': "Detector 4", 'is_nemea_mod': True, 'is_sr_ready': True, 'sr_cb_ready': True},
{'path': '/a/c/b/de/ee', 'instances': [],'in_ifces_cnt': '2', 'out_ifces_cnt': '0','enabled': False, 'name': "Detector 5", 'is_nemea_mod': False, 'is_sr_ready': False, 'sr_cb_ready': False},
{'path': '/a/c/b/dd/ee', 'instances': [],'in_ifces_cnt': '0', 'out_ifces_cnt': '0','enabled': False, 'name': "Detector 6", 'is_nemea_mod': False, 'is_sr_ready': False, 'sr_cb_ready': False},
{'path': '/a/c/b/da/ee', 'instances': [],'in_ifces_cnt': '0', 'out_ifces_cnt': '*','enabled': True, 'name': "Detector 7", 'is_nemea_mod': True, 'is_sr_ready': False, 'sr_cb_ready': False},
{'path': '/a/c/b/dd/ee', 'instances': [],'in_ifces_cnt': '0', 'out_ifces_cnt': '*','enabled': True, 'name': "Detector 8", 'is_nemea_mod': True, 'is_sr_ready': True, 'sr_cb_ready': True},
{'path': '/a/c/b/d3/ee', 'instances': [],'in_ifces_cnt': '4', 'out_ifces_cnt': '5','enabled': True, 'name': "Detector 9", 'is_nemea_mod': False, 'is_sr_ready': False, 'sr_cb_ready': False},
{'path': '/a/c3b/dd/ee', 'instances': [],'in_ifces_cnt': '5', 'out_ifces_cnt': '0','enabled': True, 'name': "Detector 10", 'is_nemea_mod': False, 'is_sr_ready': False, 'sr_cb_ready': False},
{'path': '/a/c b/dd/ee', 'instances': [],'in_ifces_cnt': '6', 'out_ifces_cnt': '2','enabled': True, 'name': "Detector 11", 'is_nemea_mod': False, 'is_sr_ready': False, 'sr_cb_ready': False},
{'path': '/a/c/333d/ee', 'instances': [],'in_ifces_cnt': '3', 'out_ifces_cnt': '*','enabled': True, 'name': "Detector 12", 'is_nemea_mod': False, 'is_sr_ready': False, 'sr_cb_ready': False},
]

for m in MODULES:
  m['description'] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'[0:(int(random() * 1000) %445)]

INSTANCES = []


def generate_interface(d, i):
  r = random()
  if r < 0.2:
    typ = 'TCP'
    p_name = 'tcp_params'
    if d == 'IN' and random() > 0.5:
      params = {'host':'somehost_'+str(random())}
    else:
      params = {}
    params['port'] = int(random()*1000)
    if d == 'OUT' and random() < 0.3:
      params['max_clients'] = int(random() * 10)



  elif r < 0.4:
    typ = 'TCP-TLS'
    p_name = 'tcp_tls_params'
    if d == 'IN' and random() > 0.5:
      params = {'host':'somehost_'+str(random())}
    else:
      params = {}
    params['port'] = int(random()*1000)
    if d == 'OUT' and random() < 0.3:
      params['max_clients'] = int(random() * 10)
    params['keyfile'] = '/a/b/c/d'
    params['certfile'] = '/rZb/c/d'
    params['cafile'] = '/X/b/c/d'


  elif r < 0.6:
    typ = 'UNIXSOCKET'
    p_name = 'unix_params'
    params = {'socket_name': 'socket'+str(random())[2:5]}
    if d == 'OUT' and random() < 0.3:
      params['max_clients'] = int(random() * 10)


  elif r < 0.8:
    typ = 'FILE'
    p_name = 'file_params'
    params = {'name':'file'+str(random())[2:5]}
    if d == 'OUT':
      if random() > 0.5:
        params['time'] = int(random() * 10000)*5
      if random() > 0.5:
        params['size'] = int(random() * 10000)*5
      if random() > 0.5:
        params['mode'] = choice(['a','w'])

  else:
    typ = 'BLACKHOLE'
    params = {}
    p_name = None

  if d == 'OUT' and random() < 0.3:
    params['buffer'] = choice(['on', 'off'])
  if d == 'OUT' and random() < 0.3:
    params['autoflush'] = choice(['off', int(random()*100)])   
  if random() < 0.2:
    params['timeout'] = choice(['HALF_WAIT', int(random()*100), 'WAIT', 'NO_WAIT'])

  if p_name == None:
    return {
      'name': 'i' + d[0] + str(i),
      'direction': d,
      'type': typ,
    }
  else:
    return {
      'name': 'i' + d[0] + str(i),
      'direction': d,
      'type': typ,
      p_name: params

    }


if __name__ == '__main__':
  f = open('fake_supervisor_backend_instances_data.py','w')
  f.write("INSTANCES = [\n")
  for m in MODULES:
    inst_max = int(random() * 10)
    for i in range(0, inst_max):
      in_ifces = []
      out_ifces = []

      if m['in_ifces_cnt'] == '*':
        ifc_max = int(random() * 10)
      else:
        ifc_max = int(m['in_ifces_cnt'])

      for j in range(0, ifc_max):
        in_ifces.append(generate_interface('IN', j))

      if m['out_ifces_cnt'] == '*':
        ifc_max = int(random() * 10)
      else:
        ifc_max = int(m['out_ifces_cnt'])

      for j in range(0, ifc_max):
        out_ifces.append(generate_interface('OUT', j))

      inst = {
                'name':m['name']+' instance' + str(i), 
                'max_restarts_per_min': int(random()*10),
                 'use_sysrepo': random() < 0.3,
                'running':(random()>0.5), 
                'enabled':(random()>0.5), 
                'in_ifces':in_ifces,'out_ifces':out_ifces, 
                'module_kind':m['name']
             }

      if inst['use_sysrepo']:
        inst['sysrepo_xpath'] = f"/{inst['name']}:{inst['name']}/some/path"
      else:
        inst['params'] = ''
        params_cnt = int(random() * 10) % 5
        for i in range(0, params_cnt):
          inst['params'] += choice([' -p', ' -vvv', '', '-X "asdfasdf"', '-q 42'])

      f.write(str(inst)+",\n")
  f.write(']')
  f.close()
  print('fake_supervisor_backend_instances_data.py written')
