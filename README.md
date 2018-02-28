This is not really a fork of https://github.com/CESNET/nemea-dashboard/tree/liberouter-gui, a liberouter-gui module.

### Requirements
 * nodejs, npm
 * git
 * Python 3
 * python3-pip (ubuntu package)
 * **> 1GB RAM** (because of Angular)


### Install

```
# Install requirements on ubuntu machine
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash - && \
apt-get install -y nodejs && \
npm install -g @angular/cli --allow-root && apt install git python3 python3-pip && \
ln -s /usr/bin/nodejs /usr/bin/node
```

```
# Install Liberouter GUI + Staas GUI + Nemea GUI
mkdir /var/www 2>/dev/null && cd /var/www && \
git clone https://github.com/CESNET/liberouter-gui && cd liberouter-gui/modules && \
rm -r examples/ && mkdir -p assets/img/ && touch assets/img/logo.png && \
git clone https://github.com/CESNET/Staas-GUI && mv Staas-GUI/* . && rm -r NEMEA/ Staas-GUI \
git clone https://github.com/zidekmat/nemea-gui nemea/ && \
cd ../ && python3 bootstrap.py && cd frontend/ && npm install --allow-root && \
cd ../ && pip3 install -r backend/requirements.txt
```

### Deploy
```
TODO
```
