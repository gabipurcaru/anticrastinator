#!/usr/bin/env bash

sudo systemctl disable anticrastinatord.service
sudo systemctl stop anticrastinatord.service

sudo rm /etc/systemd/system/anticrastinatord.service
sudo systemctl daemon-reload
sudo rm -rf /opt/anticrastinator/
