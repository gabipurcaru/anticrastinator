#!/usr/bin/env bash

NAME=anticrastinator_0.0-1

cd ..
npm install
cd -

rm *.deb

mkdir $NAME
mkdir -p $NAME/opt/anticrastinator/
mkdir -p $NAME/etc/systemd/system/
mkdir $NAME/DEBIAN
cp control $NAME/DEBIAN/control
cp postinst $NAME/DEBIAN/postinst
chmod 0555 $NAME/DEBIAN/postinst
cp anticrastinatord.service $NAME/etc/systemd/system/anticrastinatord.service
cp ../updater.js $NAME/opt/anticrastinator/
cp ../package.json $NAME/opt/anticrastinator/
cp -r ../node_modules $NAME/opt/anticrastinator/

dpkg-deb --build $NAME
rm -rf $NAME
