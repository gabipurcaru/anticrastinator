#!/usr/bin/env bash

git clone https://github.com/gabipurcaru/anticrastinator.git /opt/anticrastinator
cd /opt/anticrastinator
npm install

cp /opt/anticrastinator/ubuntu/anticrastinatord.service /etc/systemd/system/anticrastinatord.service
systemctl daemon-reload

systemctl enable anticrastinatord
systemctl start anticrastinatord
