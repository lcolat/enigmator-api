#!/bin/bash
PATH="/home/ubuntu/.local/bin:$PATH"
sudo cp -r /home/ubuntu/enigmator/temporary-files/ /home/ubuntu/enigmator/enigmator-api/
sudo rm -Rf /home/ubuntu/enigmator/temporary-files/
cd /home/ubuntu/enigmator/enigmator-api/
chown -Rf ubuntu:ubuntu /home/ubuntu/enigmator/enigmator-api/
rm server/datasources.json
cp /home/ubuntu/enigmator/environment-files/enigmator-api/datasources.json server/datasources.json
sudo docker build -t enigmator-api .