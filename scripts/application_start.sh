#!/bin/bash
APP_NAME="nodejs-Skycast"

# Check if the application is registered in PM2
echo 'run application_start.sh: ' >> /home/ec2-user/Skycast/deploy.log
echo 'pm2 restart Skycast' >> /home/ec2-user/Skycast/deploy.log
if pm2 list | grep -qw "$APP_NAME"; then
  pm2 restart 'nodejs-Skycast' >> /home/ec2-user/Skycast/deploy1.log
else
  pm2 start npm --name=nodejs-Skycast -- start
fi
