#!/bin/bash

set -e

# Install CF
curl https://s3-us-west-1.amazonaws.com/cf-cli-releases/releases/v6.46.1/cf-cli_6.46.1_linux_x86-64.tgz | tar xzvf -
sudo mv cf /usr/local/bin/cf

# Log into cloud.gov
cf api api.fr.cloud.gov
cf login -u $CF_USERNAME -p $CF_PASSWORD -o gsa-opp-analytics -s analytics-dev

# Push the app
cf v3-zdt-push analytics

cf logout
