---
layout: developer
permalink: /developer/
---
<!-- Alpha status alert -->
<div class="usa-alert usa-alert-warning" id="site-wide-alert" role="alert">
   <div class="usa-alert-body">
     <h3 class="usa-alert-heading">
       This project is in Alpha
     </h3>
     <p class="usa-alert-text">
       This API is under active development, and breaking changes may be made without warning.
       Have feedback or questions? <a href="https://github.com/18F/analytics.usa.gov/issues">Please let us know</a>!
     </p>
   </div>
 </div>
<!-- end Alpha status alert -->

# The analytics.usa.gov API

In addition to being published and available for download, the data generated for this site is also available via an API.

The URL for the API is `https://api.gsa.gov/analytics/dap/v1`, and it exposes 2 routes to query data:

- `/reports/<report name>/data`
- `/agencies/<agency name>/reports/<report name>/data`

## API Keys

To use the API, please register for an API key below and include it in your query in this fashion:

- `https://api.gsa.gov/analytics/dap/v1/reports/download/data?api_key=DEMO_KEY1`

{% raw %}

<div id="apidatagov_signup">Loading signup form...</div>
<script type="text/javascript">
  /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
  var apiUmbrellaSignupOptions = {
    // Pick a short, unique name to identify your site, like 'gsa-auctions'
    // in this example.
    registrationSource: 'gsa-dap-api',

    // Enter the API key you signed up for and specially configured for this
    // API key signup embed form.
    apiKey: 'LQekm6CxhGGrjRGkBsZjJD4R0Rr8sKYRtX1ey4qX',

    // Provide an example URL you want to show to users after they signup.
    // This can be any API endpoint on your server, and you can use the
    // special {{api_key}} variable to automatically substitute in the API
    // key the user just signed up for.
    exampleApiUrl: 'https://api.gsa.gov/analytics/dap/v1/reports/download/data?api_key={{api_key}}',

    // OPTIONAL: Provide extra content to display on the signup confirmation
    // page. This will be displayed below the user's API key and the example
    // API URL are shown. HTML is allowed. Defaults to ""
    // signupConfirmationMessage: '',

    // OPTIONAL: Provide a URL to your own contact page to link to for user
    // support. Defaults to "https://api.data.gov/contact/"
    contactUrl: 'https://github.com/18F/analytics.usa.gov/issues',

    // OPTIONAL: Set to true to verify the user's e-mail address by only
    // sending them their API key via e-mail, and not displaying it on the
    // signup confirmation web page. Defaults to false.
    // verifyEmail: true,

    // OPTIONAL: Set to false to disable sending a welcome e-mail to the
    // user after signing up. Defaults to true.
    // sendWelcomeEmail: false,

    // OPTIONAL: Provide the name of your developer site. This will appear
    // in the subject of the welcome e-mail as "Your {{siteName}} API key".
    // Defaults to "api.data.gov".
    // siteName: 'analytics.usa.gov',

    // OPTIONAL: Provide a custom sender name for who the welcome email
    // appears from. The actual address will be "noreply@api.data.gov", but
    // this will change the name of the displayed sender in this fashion:
    // "{{emailFromName}} <noreply@api.data.gov>". Defaults to "".
    emailFromName: 'analytics.usa.gov',

    // OPTIONAL: Provide an extra input field to ask for the user's website.
    // Defaults to false.
    // websiteInput: true,

    // OPTIONAL: Provide an extra checkbox asking the user to agree to terms
    // and conditions before signing up. Defaults to false.
    // termsCheckbox: true,

    // OPTIONAL: If the terms & conditions checkbox is enabled, link to this
    // URL for your API's terms & conditions. Defaults to "".
    // termsUrl: "https://agency.gov/api-terms/",
  };

  /* * * DON'T EDIT BELOW THIS LINE * * */
  (function() {
    var apiUmbrella = document.createElement('script'); apiUmbrella.type = 'text/javascript'; apiUmbrella.async = true;
    apiUmbrella.src = 'https://api.data.gov/static/javascripts/signup_embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(apiUmbrella);
  })();
</script>
<noscript>Please enable JavaScript to signup for an <a href="http://api.data.gov/">api.data.gov</a> API key.</noscript>

{% endraw %}


## The Response

The response represents the rows in the `data` array in the JSON reports that can be downloaded, or the rows in the CSV files that can be downloaded. They are returned as an array of JSON objects. Here is an example of one such object:

```
{
  "id": 60716,
  "report_name": "today",
  "report_agency": "justice",
  "date_time": "2017-04-07T14:00:00.000Z",
  "data": {
    "visits": "4240"
  },
  "created_at": "2017-04-07T04:23:55.792Z",
  "updated_at": "2017-04-07T04:23:55.792Z"
}
```

Note that is has the following properties:

- `id`: The primary key of the data point
- `report_name`: The name of the data point's report
- `report_agency`: The name of the data point's agency
- `date_time`: The data/time the data in the data point corresponds to
- `data`: The data associated with the data point. This may contain child properties such as visits, browser, screen size, and so on, depending on the report

## Querying reports

Reports can be queried by substituting `<report name>` in the path with the name of the report.

The following reports can be queried using the API:

- download  _([example](https://api.gsa.gov/analytics/dap/v1/reports/download/data?api_key=DEMO_KEY1))_
- traffic-source  _([example](https://api.gsa.gov/analytics/dap/v1/reports/traffic-source/data?api_key=DEMO_KEY1))_
- device-model  _([example](https://api.gsa.gov/analytics/dap/v1/reports/device-model/data?api_key=DEMO_KEY1))_
- domain  _([example](https://api.gsa.gov/analytics/dap/v1/reports/domain/data?api_key=DEMO_KEY1))_
- site  _([example](https://api.gsa.gov/analytics/dap/v1/reports/site/data?api_key=DEMO_KEY1))_
- second-level-domain  _([example](https://api.gsa.gov/analytics/dap/v1/reports/second-level-domain/data?api_key=DEMO_KEY1))_
- language  _([example](https://api.gsa.gov/analytics/dap/v1/reports/language/data?api_key=DEMO_KEY1))_
- os-browser  _([example](https://api.gsa.gov/analytics/dap/v1/reports/os-browser/data?api_key=DEMO_KEY1))_
- windows-browser  _([example](https://api.gsa.gov/analytics/dap/v1/reports/windows-browser/data?api_key=DEMO_KEY1))_
- browser  _([example](https://api.gsa.gov/analytics/dap/v1/reports/browser/data?api_key=DEMO_KEY1))_
- windows-ie  _([example](https://api.gsa.gov/analytics/dap/v1/reports/windows-ie/data?api_key=DEMO_KEY1))_
- os  _([example](https://api.gsa.gov/analytics/dap/v1/reports/os/data?api_key=DEMO_KEY1))_
- windows  _([example](https://api.gsa.gov/analytics/dap/v1/reports/windows/data?api_key=DEMO_KEY1))_
- ie  _([example](https://api.gsa.gov/analytics/dap/v1/reports/ie/data?api_key=DEMO_KEY1))_
- device  _([example](https://api.gsa.gov/analytics/dap/v1/reports/device/data?api_key=DEMO_KEY1))_

## Filtering based on agencies

Reports can be queried by substituting `<agency name>` in the path with the name of the agency. If the path without an agency name parameter is used, the reports correspond to government wide data.

The list of valid agency names includes:

- agency-international-development  _([example](https://api.gsa.gov/analytics/dap/v1/agencies/agency-international-development/reports/site/data?api_key=DEMO_KEY1))_
- agriculture  _([example](https://api.gsa.gov/analytics/dap/v1/agencies/agriculture/reports/site/data?api_key=DEMO_KEY1))_
- commerce  _([example](https://api.gsa.gov/analytics/dap/v1/agencies/commerce/reports/site/data?api_key=DEMO_KEY1))_
- defense  _([example](https://api.gsa.gov/analytics/dap/v1/agencies/defense/reports/site/data?api_key=DEMO_KEY1))_
- education  _([example](https://api.gsa.gov/analytics/dap/v1/agencies/education/reports/site/data?api_key=DEMO_KEY1))_
- energy  _([example](https://api.gsa.gov/analytics/dap/v1/agencies/energy/reports/site/data?api_key=DEMO_KEY1))_
- environmental-protection-agency  _([example](https://api.gsa.gov/analytics/dap/v1/agencies/environmental-protection-agency/reports/site/data?api_key=DEMO_KEY1))_
- executive-office-president  _([example](https://api.gsa.gov/analytics/dap/v1/agencies/executive-office-president/reports/site/data?api_key=DEMO_KEY1))_
- general-services-administration  _([example](https://api.gsa.gov/analytics/dap/v1/agencies/general-services-administration/reports/site/data?api_key=DEMO_KEY1))_
- health-human-services  _([example](https://api.gsa.gov/analytics/dap/v1/agencies/health-human-services/reports/site/data?api_key=DEMO_KEY1))_
- homeland-security  _([example](https://api.gsa.gov/analytics/dap/v1/agencies/homeland-security/reports/site/data?api_key=DEMO_KEY1))_
- housing-urban-development  _([example](https://api.gsa.gov/analytics/dap/v1/agencies/housing-urban-development/reports/site/data?api_key=DEMO_KEY1))_
- interior  _([example](https://api.gsa.gov/analytics/dap/v1/agencies/interior/reports/site/data?api_key=DEMO_KEY1))_
- justice  _([example](https://api.gsa.gov/analytics/dap/v1/agencies/justice/reports/site/data?api_key=DEMO_KEY1))_
- labor  _([example](https://api.gsa.gov/analytics/dap/v1/agencies/labor/reports/site/data?api_key=DEMO_KEY1))_
- national-aeronautics-space-administration  _([example](https://api.gsa.gov/analytics/dap/v1/agencies/national-aeronautics-space-administration/reports/site/data?api_key=DEMO_KEY1))_
- national-archives-records-administration  _([example](https://api.gsa.gov/analytics/dap/v1/agencies/national-archives-records-administration/reports/site/data?api_key=DEMO_KEY1))_
- national-science-foundation  _([example](https://api.gsa.gov/analytics/dap/v1/agencies/national-science-foundation/reports/site/data?api_key=DEMO_KEY1))_
- nuclear-regulatory-commission  _([example](https://api.gsa.gov/analytics/dap/v1/agencies/nuclear-regulatory-commission/reports/site/data?api_key=DEMO_KEY1))_
- office-personnel-management  _([example](https://api.gsa.gov/analytics/dap/v1/agencies/office-personnel-management/reports/site/data?api_key=DEMO_KEY1))_
- postal-service  _([example](https://api.gsa.gov/analytics/dap/v1/agencies/postal-service/reports/site/data?api_key=DEMO_KEY1))_
- small-business-administration  _([example](https://api.gsa.gov/analytics/dap/v1/agencies/small-business-administration/reports/site/data?api_key=DEMO_KEY1))_
- social-security-administration  _([example](https://api.gsa.gov/analytics/dap/v1/agencies/social-security-administration/reports/site/data?api_key=DEMO_KEY1))_
- state  _([example](https://api.gsa.gov/analytics/dap/v1/agencies/state/reports/site/data?api_key=DEMO_KEY1))_
- transportation  _([example](https://api.gsa.gov/analytics/dap/v1/agencies/transportation/reports/site/data?api_key=DEMO_KEY1))_
- treasury  _([example](https://api.gsa.gov/analytics/dap/v1/agencies/treasury/reports/site/data?api_key=DEMO_KEY1))_
- veterans-affairs  _([example](https://api.gsa.gov/analytics/dap/v1/agencies/veterans-affairs/reports/site/data?api_key=DEMO_KEY1))_

## Query params

The following query params are supported to work with the data:

- `limit`: Limit the number of data points that are rendered. The default is 1000 and the max is 10,000
- `page`: Pages through the results. If the limit is set to `1000`, using `page=2` will render the 1001st through 2000th data point.
