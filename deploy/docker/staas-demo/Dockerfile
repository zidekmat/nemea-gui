# This is demo
FROM zmat/nemea-supervisor-sysrepo-edition:0.1

# Install Angular
RUN curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo bash - && \
    yum install -y nodejs && npm install --unsafe-perm -g @angular/cli

# Install Python dependencies for backend
RUN dnf install -y python3-pip python3-devel libffi-devel redhead-rpm-config mongodb-server

# Install STaaS GUI with this NEMEA GUI
RUN mkdir /var/www 2>/dev/null && chown -R $(whoami):$(whoami) /var/www && \
  cd /var/www && \
  git clone https://github.com/CESNET/liberouter-gui && cd liberouter-gui/modules && \
  rm -r example/ && mkdir -p assets/img/ && touch assets/img/logo.png && \
  git clone https://github.com/CESNET/Staas-GUI && mv Staas-GUI/* . && \
  rm -rf NEMEA/ Staas-GUI/ examples/ && \
  git clone https://github.com/zidekmat/nemea-gui nemea/ && \
  cd ../ && python3 bootstrap.py && cd frontend/ && npm install --allow-root && \
  cd ../ && sudo pip3 install -r backend/requirements.txt

# Start MongoDB, it's reguired by NEMEA GUI
RUN systemctl start mongod

# Start API in background 
RUN python3 /var/www/liberouter-gui/backend 2>&1 1>/var/log/liberouter-api.log &

# Expose API port
EXPOSE 5555/tcp
# Expose frontend hosting port
EXPOSE 4200/tcp

WORKDIR /var/www/liberouter-gui/frontend
CMD ["ng", "serve", "--preserve-symlinks", "--proxy", "proxy.json"]
