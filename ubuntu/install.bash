#!/usr/bin/env bash

git clone git@github.com:gabipurcaru/anticrastinator.git /opt/anticrastinator
cd /opt/anticrastinator
node install

sudo mv /opt/anticrastinator/ubuntu/anticrastinatord.service /etc/systemd/system/anticrastinatord.service
sudo systemctl daemon-reload

sudo systemctl enable anticrastinatord
sudo systemctl start anticrastinatord
