#!/bin/bash

set -e

# Install CF
curl https://s3-us-west-1.amazonaws.com/cf-cli-releases/releases/v6.25.0/cf-cli_6.25.0_linux_x86-64.tgz | tar xzvf -
mv cf /home/ubuntu/bin/cf

# Log into cloud.gov
cf api api.fr.cloud.gov
cf login -u $CF_USERNAME -p $CF_PASSWORD -o gsa-opp-analytics -s analytics-dev

# Push the app
cf push analytics

cf logout
