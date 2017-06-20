
This document is to memorialize internal project procedures.  Other agencies or teams not at GSA are free to adopt them as well, but don't have to in order to use the software.  

### Cloud.gov Access 

The System owner and current project developers need cloud.gov access to analytics.usa.gov.  The system owner (currently Gray Brooks) manages this access, granting access to new project developers when they come onboard and removing access when they leave.  

Specifically, current developers are [granted](https://cloud.gov/docs/apps/managing-teammates/) OrgManager rights to `gsa-opp-analytics` and SpaceDeveloper rights to each of the projects spaces.  

Both of the adding and removing processes should be initiated by creating an issue in the project's [issue tracker](https://github.com/18F/analytics.usa.gov/issues).  Any one can create the issue, but the system owner should be the one who addresses and closes it.    


### GitHub Access 

The System owner and current project developers need commit rights to analytics.usa.gov project repositories ([here](https://github.com/18F/analytics.usa.gov), [here](https://github.com/18f/analytics-reporter), and [here](https://github.com/18f/analytics-reporter-api)).  The system owner (currently Gray Brooks) manages this access, granting access to new project developers when they come onboard and removing access when they leave.  

Specifically, current developers are managed as the `analytics.usa.gov` team in the 18F GitHub organization.   

Both of the adding and removing processes should be initiated by creating an issue in the project's [issue tracker](https://github.com/18F/analytics.usa.gov/issues).  Any one can create the issue, but the system owner should be the one who addresses and closes it.  

### Monitoring of Cloud.gov Logs

The development team monitors and reviews logs at https://logs.fr.cloud.gov for unapproved and unusual activities at least monthly. 

Any unusual or suspicious activities are immediately brought to the team's attention in the project slack channel (#dap) and the system owner coordinates appropriate investigation and followup.  

### Monitoring of New Relic Alerts

New Relic alerts are emailed to the full team immediately.  The first team member to see the alert checks the site's status and posts in the project slack channel (#dap) the results.  The system owner then coordinates any necessary followup.  
