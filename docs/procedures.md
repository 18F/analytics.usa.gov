
This document is to memorialize internal project procedures.  Other agencies or teams not at GSA are free to adopt them as well, but don't have to in order to use the software.  

### Cloud.gov Access 

The System owner and current project developers need cloud.gov access to analytics.usa.gov.  The system owner (currently Gray Brooks) manages this access, granting access to new project developers when they come onboard and removing access when they leave.  

Specifically, current developers are [granted](https://cloud.gov/docs/apps/managing-teammates/) OrgManager rights to `gsa-opp-analytics` and SpaceDeveloper rights to each of the projects spaces.  

Both of the adding and removing processes should be initiated by creating an issue in the project's [issue tracker](https://github.com/18F/analytics.usa.gov/issues).  Any one can create the issue, but the system owner should be the one who addresses and closes it.    


### GitHub Access 

The System owner and current project developers need commit rights to analytics.usa.gov project repositories ([here](https://github.com/18F/analytics.usa.gov), [here](https://github.com/18f/analytics-reporter), and [here](https://github.com/18f/analytics-reporter-api)).  The system owner (currently Gray Brooks) manages this access, granting access to new project developers when they come onboard and removing access when they leave.  

Specifically, current developers are managed as the `analytics.usa.gov` team in the 18F GitHub organization.   

Both of the adding and removing processes should be initiated by creating an issue in the project's [issue tracker](https://github.com/18F/analytics.usa.gov/issues).  Any one can create the issue, but the system owner should be the one who addresses and closes it.  

### Weekly Monitoring Checklist

The development team checks for security events weekly. Any unusual or suspicious activities are immediately brought to the team's attention in the project slack channel (#dap) and the system owner coordinates appropriate investigation and followup. The team will follow the [18F incident response handbook](https://handbook.18f.gov/security-incidents/).

Checklist:
1. Create an issue in the project's [issue tracker](https://github.com/18F/analytics.usa.gov/issues) to track this Security Event Review.
2. Review Gemnasium for all repositories and open a ticket for all "red" alerts.
3. Review [production logs](https://logs.fr.cloud.gov) for unapproved and unusual activities. 
4. Review actionable security events on production logs for successful and unsuccessful account logon events, account management events, object access, policy change, privilege functions, process tracking, system events, all administrator activity, authentication checks, authorization checks, data deletions, data access, data changes, and permission changes.
5. Deactivate any cloud.gov and github access for people who have left the team.
6. Note any findings in the Security Event Review issue.
7. Close the Security Event Review issue.

### Monitoring of New Relic Alerts

New Relic alerts are emailed to the full team immediately.  The first team member to see the alert checks the site's status and posts in the project slack channel (#dap) the results.  The system owner then coordinates any necessary followup.  
