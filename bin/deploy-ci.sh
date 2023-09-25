#!/bin/bash

set -e

if [ "${CIRCLE_BRANCH}" == "master" ]; then
  # Log into cloud.gov
  cf api api.fr.cloud.gov
  cf login -u $CF_USERNAME -p $CF_PASSWORD -o gsa-opp-analytics -s analytics-dev

  # Push the app
  cf v3-zdt-push analytics
  cf logout
fi

if [ "${CIRCLE_BRANCH}" == "develop" ]; then
  # Log into cloud.gov
  cf api api.fr.cloud.gov
  cf login -u $CF_USERNAME -p $CF_PASSWORD -o gsa-opp-analytics -s analytics-dev

  # Push the app
  cf push -f "./manifest.yml"
  cf logout
fi
