#!/usr/bin/env bash

sudo git clone https://github.com/gabipurcaru/anticrastinator.git /opt/anticrastinator
cd /opt/anticrastinator
sudo npm install

sudo cp /opt/anticrastinator/ubuntu/anticrastinatord.service /etc/systemd/system/anticrastinatord.service
sudo systemctl daemon-reload

sudo systemctl enable anticrastinatord
sudo systemctl start anticrastinatord
