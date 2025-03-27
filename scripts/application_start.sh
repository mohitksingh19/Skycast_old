#!/bin/bash
echo 'run application_start.sh: ' >> /home/ec2-user/Skycast/deploy.log
echo 'pm2 restart Skycast' >> /home/ec2-user/Skycast/deploy.log
pm2 restart 'nodejs-Skycast' >> /home/ec2-user/Skycast/deploy.log
