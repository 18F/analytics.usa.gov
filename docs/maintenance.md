

## Project Notes

* Repos: [analytics.usa.gov](https://github.com/18f/analytics.usa.gov), [analytics-reporter](https://github.com/18f/analytics-reporter), [analytics-reporter-api](https://github.com/18f/analytics-reporter-api)
* [System Documents](https://drive.google.com/drive/u/1/folders/0B4f3E1-4As-aaW82VWR1ejZGREE)
* [System Diagram](https://docs.google.com/drawings/d/1eKmjl1ht0QLXU3PaFZ-FHuudK-4AtxkU8-rjUH8Com0/edit)
* [Install Instructions](https://github.com/18f/analytics.usa.gov#setup-using-docker)
* Credentials 
  * Cloud.gov (Deployer) - Gray Brooks and Jonathan Hooper have access to manage this.  
  * Cloud.gov (Access) - Gray Brooks, Jonathan Hooper, and Tim Lowden have access to manage this. 
  * New Relic - Gray Brooks, Jonathan Hooper, and Tim Lowden have access to manage this. 
  * Circle CI - Gray Brooks, Jonathan Hooper, and Tim Lowden have access to manage this.  
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


