# NEMEA GUI

This is fork of [https://github.com/CESNET/nemea-dashboard/tree/liberouter-gui](https://github.com/CESNET/nemea-dashboard/tree/liberouter-gui), a [Liberouter GUI](https://github.com/CESNET/liberouter-gui) module. It adds ability to configure new [NEMEA Supervisor sysrepo edition](https://github.com/zidekmat/nemea-supervisor-sysrepo-edition) that uses sysrepo as it's configuration datastore. 

### What is included

 * NEMEA Supervisor GUI
 * NEMEA Events & Dashboard
 * NEMEA Reporter configuration
 * ~~NEMEA Status~~ (currently not working with included Supervisor)

### Requirements
 * NEMEA Supervisor sysrepo edition (and its dependencies)
 * sysrepo bindings for Python 3
 * MongoDB (for backend/events.py)
 * nodejs, npm
 * git
 * Python 3, Pip 3
 * **> 1GB RAM** (because of Angular...)


### Install
1) Install requirements. Here are specific instructions for Fedora 27 machine:
```
sudo dnf install -y curl && curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo bash - && \
sudo yum install -y nodejs && \
sudo npm install --unsafe-perm -g @angular/cli && \
sudo dnf install -y python3-pip python3-devel libffi-devel redhead-rpm-config git mongodb-server
```

2) For installation instructions on how to install NEMEA Supervisor see its git repository.
3) Install and configure Liberouter GUI + Staas GUI + Nemea GUI:
```
sudo mkdir /var/www 2>/dev/null && sudo chown -R $(whoami):$(whoami) /var/www && \
cd /var/www && \
git clone https://github.com/CESNET/liberouter-gui && cd liberouter-gui/modules && \
rm -r example/ && mkdir -p assets/img/ && touch assets/img/logo.png && \
git clone https://github.com/CESNET/Staas-GUI && mv Staas-GUI/* . && \
rm -rf NEMEA/ Staas-GUI/ examples/ && \
git clone https://github.com/zidekmat/nemea-gui nemea/ && \
cd ../ && python3 bootstrap.py && cd frontend/ && npm install --allow-root && \
cd ../ && sudo pip3 install -r backend/requirements.txt
```

### Run (devel mode)
Start MongoDB first:
```
sudo systemctl start mongod
```
In one terminal serve angular files:
```
cd /var/www/liberouter-gui/frontend && ng serve --preserve-symlinks --proxy proxy.json
```

In second terminal run Flask API:
```
python3 /var/www/liberouter-gui/backend
```
Now you should have the web application available at //localhost:4200.

### Run (production mode)
Besided from starting NEMEA Supervisor, sysrepo daemon and mongodb see [Liberouter GUI wiki](https://github.com/CESNET/liberouter-gui/wiki/Deploying-LiberouterGUI) for production deployment. Just be careful how many threads you set for WSGI to have, set only one to ensure there would be no problems with parallelism in Supervisor API.


### Docker
See `deploy/` folder for Dockerfile and instructions.
