This is not really a fork of https://github.com/CESNET/nemea-dashboard/tree/liberouter-gui, a liberouter-gui module.

An humble attempt to unify and merge everything.


### Install
```
git clone https://github.com/CESNET/liberouter-gui && cd liberouter-gui && \
rm -r example/ && mkdir -p assets/img/ && touch assets/img/logo.png && \
git clone https://github.com/CESNET/Staas-GUI . && \
git clone https://github.com/zidekmat/nemea-gui nemea/ && \
cd ../ && python3 bootstrap.py && cd frontend/ && npm install && \
cd ../ && pip3 install -r backend/requirements.txt
```