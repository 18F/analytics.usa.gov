

## Project Notes

* Repos: [analytics.usa.gov](https://github.com/18f/analytics.usa.gov), [analytics-reporter](https://github.com/18f/analytics-reporter), [analytics-reporter-api](https://github.com/18f/analytics-reporter-api)
* [System Documents](https://drive.google.com/drive/u/1/folders/0B4f3E1-4As-aaW82VWR1ejZGREE)
* [System Diagram](https://docs.google.com/drawings/d/1eKmjl1ht0QLXU3PaFZ-FHuudK-4AtxkU8-rjUH8Com0/edit)
* [Install Instructions](https://github.com/18f/analytics.usa.gov#setup-using-docker)
* Credentials
  * Cloud.gov (Deployer) - Gray Brooks and Jonathan Hooper have access to manage this.
  * Cloud.gov (Access) - Gray Brooks, Jonathan Hooper, and Tim Lowden have access to manage this.
  * New Relic (APM and Synthetics) - Gray Brooks, Jonathan Hooper, and Eric Mill have access to manage this.
  * Circle CI - Gray Brooks, Jonathan Hooper, and Tim Lowden have access to manage this, as access is managed through github permissions.
  * Google Analytics API - They are stored in the `analytics-reporter` environment and can be found by runnning `cf env analytics-reporter` when logged into cloud.gov on the command line and targeting the `gsa-opp-analytics` org and the `analytics-dev` space.  Gray Brooks, Jonathan Hooper, and Tim Lowden also have the keys stored.
  * AWS - Provided by a cloud.gov service.
  * Google Analytics (Digital Analytics Program)

* Points of contact
  * Cloud.gov - #cloud-gov in Slack; cloud-gov-support@gsa.gov.
  * New Relic - #admins-newrelic in Slack
  * Api.data.gov - #api-data-gov in Slack; api.data.gov@gsa.gov
* Important URLs
  * [Cloud.gov Console](http://console.fr.cloud.gov/)
  * [Cloud.gov Docs](https://cloud.gov/docs/)
  * [Cloud.gov Logs](https://logs.fr.cloud.gov)
  * [Circle CI Management](https://circleci.com)
  * [New Relic Management](https://newrelic.com/)
  * [Api.data.gov Management](https://api.data.gov/admin)
  * [Google Analytics](https://www.google.com/analytics)
  * [Google Analytics API Dashboard](https://console.developers.google.com/apis/api/analytics.googleapis.com/overview)



## Regular Tasks

* Check Gemnasium and Snyk to review if we need to update depedencies.
* Update dependencies.
* Process issues and pull requests in the three repos.
* Look at logs for irregularities.
* Check the s3 bucket for stale data.
* Reconsider need to scale resources up or down.

## Rotating Deployer Credentials

After a number of months, [the cloud.gov space deployer](https://cloud.gov/docs/services/cloud-gov-service-account/) account's credentials will expire. This causes regular builds on CI to start failing. To rotate the credentials, follow the following series of steps:

First, delete the old credentials. To begin, find the name of the service key:

```shell
cf service-keys analytics-deployer-account
```

Once you have the name, you can delete it:

```shell
cf delete-service-key analytics-deployer-account <service key name>
```

Once the old one is deleted, create a new one:

```shell
cf create-service-key analytics-deployer-account analytics-deployer-key
```

Now, get the credentials for the new service by running the following:

```shell
cf service-key analytics-deployer-account analytics-deployer-key
```

This should give you a username and password. The username and password will be used to update the environment variables in CI. This needs to be done in the following places:

- [analytics.usa.gov CircleCI settings](https://circleci.com/gh/18F/analytics.usa.gov/edit#env-vars)
- [analytics-reporter CircleCI settings](https://circleci.com/gh/18F/analytics-reporter/edit#env-vars)
- [analytics-reporter-api CircleCI settings](https://circleci.com/gh/18F/analytics-reporter-api/edit#env-vars)
- [analytics-restarter CircleCI settings](https://circleci.com/gh/18F/analytics-restarter/edit#env-vars)

In the settings, the old `CF_USERNAME` and `CF_PASSWORD` values will need to be deleted and re-added with the new username and password values.

## Restarting the app in cloud.gov 

Sometimes if the site is acting up, it helps to restart the app in cloud.gov.  Here's how to do that.  

* Log in at http://console.fr.cloud.gov/.  
* Navigate to the `gsa-opp-anlaytics` org, then the `analytics` app in the `analytics-dev` space.
* Click on the Restart app button.  

## Adding/Removing users in cloud.gov 

* In a terminal, enter `cf login -a api.fr.cloud.gov --sso`.  
* Follow the directions to log in.  
* Use [these commands](https://cloud.gov/docs/apps/managing-teammates/) to add/edit/remove users.  

