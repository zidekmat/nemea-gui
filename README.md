This is not really a fork of https://github.com/CESNET/nemea-dashboard/tree/liberouter-gui, a liberouter-gui module.

### Requirements
 * nodejs, npm
 * git
 * Python 3
 * python3-pip (ubuntu package)
 * **> 1GB RAM** (because of Angular)


### Install

Install requirements on ubuntu machine:
```
sudo apt install curl -y && curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash - && \
sudo apt-get install -y nodejs && \
sudo npm install --unsafe-perm -g @angular/cli && \
sudo apt install git python3 && \
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py && \
sudo python3 get-pip.py && \
sudo ln -s /usr/bin/nodejs /usr/bin/node 2>/dev/null
```

Install Liberouter GUI + Staas GUI + Nemea GUI:
```
sudo mkdir /var/www 2>/dev/null && sudo chown -R $(whoami):$(whoami) /var/www && \
cd /var/www && \
git clone https://github.com/CESNET/liberouter-gui && cd liberouter-gui/modules && \
rm -r example/ && mkdir -p assets/img/ && touch assets/img/logo.png && \
git clone https://github.com/CESNET/Staas-GUI && mv Staas-GUI/* . && \
rm -rf NEMEA/ Staas-GUI/ examples/ && \
git clone https://github.com/zidekmat/nemea-gui nemea/ && \
cd ../ && python3 bootstrap.py && cd frontend/ && npm install --allow-root && \
sudo pip3 install flask
# use this once real API is implemented
# cd ../ && sudo pip3 install -r backend/requirements.txt
```

### Development

In one terminal run the fake API:
```
python3 /var/www/liberouter-gui/modules/nemea/backend/fake_supervisor_backend.py
```

In other terminal run angular:
```
cd /var/www/liberouter-gui/frontend && ng serve --proxy proxy.json
```


### Deploy
```
TODO
```
