#!/usr/bin/env bash

systemctl disable anticrastinatord.service
systemctl stop anticrastinatord.service

rm /etc/systemd/system/anticrastinatord.service
systemctl daemon-reload
rm -rf /opt/anticrastinator/
