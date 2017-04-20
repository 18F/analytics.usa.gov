---
layout: developer
permalink: /developer/
---

# The analytics.usa.gov API

In addition to being published and available for download, the data generated for this site is also available via an API.

The URL for the API is `https://api.gsa.gov/systems/dap`, and it exposes 2 routes to query data:

- `/reports/<report name>/data`
- `/agencies/<agency name>/reports/<report name>/data`

## API Keys

To use the API, please register for [an API key](https://api.data.gov/signup/) and include it in your query in this fashion:  

- `https://api.gsa.gov/systems/dap/reports/today/data?api_key=DEMO_KEY1`

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

- devices  _([example](https://api.gsa.gov/systems/dap/reports/devices/data?api_key=DEMO_KEY1))_
- browsers  _([example](https://api.gsa.gov/systems/dap/reports/browsers/data?api_key=DEMO_KEY1))_
- windows-ie  _([example](https://api.gsa.gov/systems/dap/reports/windows-ie/data?api_key=DEMO_KEY1))_
- windows-browsers  _([example](https://api.gsa.gov/systems/dap/reports/windows-browsers/data?api_key=DEMO_KEY1))_
- device_model  _([example](https://api.gsa.gov/systems/dap/reports/device_model/data?api_key=DEMO_KEY1))_
- ie  _([example](https://api.gsa.gov/systems/dap/reports/ie/data?api_key=DEMO_KEY1))_
- today  _([example](https://api.gsa.gov/systems/dap/reports/today/data?api_key=DEMO_KEY1))_
- os-browsers  _([example](https://api.gsa.gov/systems/dap/reports/os-browsers/data?api_key=DEMO_KEY1))_
- os  _([example](https://api.gsa.gov/systems/dap/reports/os/data?api_key=DEMO_KEY1))_
- windows  _([example](https://api.gsa.gov/systems/dap/reports/windows/data?api_key=DEMO_KEY1))_
- screen-size  _([example](https://api.gsa.gov/systems/dap/reports/screen-size/data?api_key=DEMO_KEY1))_
- language  _([example](https://api.gsa.gov/systems/dap/reports/language/data?api_key=DEMO_KEY1))_


## Filtering based on agencies

Reports can be queried by substituting `<agency name>` in the path with the name of the agency. If the path without an agency name parameter is used, the reports correspond to government wide data.

The list of valid agency names includes:

- agency-international-development  _([example](https://api.gsa.gov/systems/dap/agencies/agency-international-development/reports/site/data?api_key=DEMO_KEY1))_
- agriculture  _([example](https://api.gsa.gov/systems/dap/agencies/agriculture/reports/site/data?api_key=DEMO_KEY1))_
- commerce  _([example](https://api.gsa.gov/systems/dap/agencies/commerce/reports/site/data?api_key=DEMO_KEY1))_
- defense  _([example](https://api.gsa.gov/systems/dap/agencies/defense/reports/site/data?api_key=DEMO_KEY1))_
- education  _([example](https://api.gsa.gov/systems/dap/agencies/education/reports/site/data?api_key=DEMO_KEY1))_
- energy  _([example](https://api.gsa.gov/systems/dap/agencies/energy/reports/site/data?api_key=DEMO_KEY1))_
- environmental-protection-agency  _([example](https://api.gsa.gov/systems/dap/agencies/environmental-protection-agency/reports/site/data?api_key=DEMO_KEY1))_
- executive-office-president  _([example](https://api.gsa.gov/systems/dap/agencies/executive-office-president/reports/site/data?api_key=DEMO_KEY1))_
- general-services-administration  _([example](https://api.gsa.gov/systems/dap/agencies/general-services-administration/reports/site/data?api_key=DEMO_KEY1))_
- health-human-services  _([example](https://api.gsa.gov/systems/dap/agencies/health-human-services/reports/site/data?api_key=DEMO_KEY1))_
- homeland-security  _([example](https://api.gsa.gov/systems/dap/agencies/homeland-security/reports/site/data?api_key=DEMO_KEY1))_
- housing-urban-development  _([example](https://api.gsa.gov/systems/dap/agencies/housing-urban-development/reports/site/data?api_key=DEMO_KEY1))_
- interior  _([example](https://api.gsa.gov/systems/dap/agencies/interior/reports/site/data?api_key=DEMO_KEY1))_
- justice  _([example](https://api.gsa.gov/systems/dap/agencies/justice/reports/site/data?api_key=DEMO_KEY1))_
- labor  _([example](https://api.gsa.gov/systems/dap/agencies/labor/reports/site/data?api_key=DEMO_KEY1))_
- national-aeronautics-space-administration  _([example](https://api.gsa.gov/systems/dap/agencies/national-aeronautics-space-administration/reports/site/data?api_key=DEMO_KEY1))_
- national-archives-records-administration  _([example](https://api.gsa.gov/systems/dap/agencies/national-archives-records-administration/reports/site/data?api_key=DEMO_KEY1))_
- national-science-foundation  _([example](https://api.gsa.gov/systems/dap/agencies/national-science-foundation/reports/site/data?api_key=DEMO_KEY1))_
- nuclear-regulatory-commission  _([example](https://api.gsa.gov/systems/dap/agencies/nuclear-regulatory-commission/reports/site/data?api_key=DEMO_KEY1))_
- office-personnel-management  _([example](https://api.gsa.gov/systems/dap/agencies/office-personnel-management/reports/site/data?api_key=DEMO_KEY1))_
- postal-service  _([example](https://api.gsa.gov/systems/dap/agencies/postal-service/reports/site/data?api_key=DEMO_KEY1))_
- small-business-administration  _([example](https://api.gsa.gov/systems/dap/agencies/small-business-administration/reports/site/data?api_key=DEMO_KEY1))_
- social-security-administration  _([example](https://api.gsa.gov/systems/dap/agencies/social-security-administration/reports/site/data?api_key=DEMO_KEY1))_
- state  _([example](https://api.gsa.gov/systems/dap/agencies/state/reports/site/data?api_key=DEMO_KEY1))_
- transportation  _([example](https://api.gsa.gov/systems/dap/agencies/transportation/reports/site/data?api_key=DEMO_KEY1))_
- treasury  _([example](https://api.gsa.gov/systems/dap/agencies/treasury/reports/site/data?api_key=DEMO_KEY1))_
- veterans-affairs  _([example](https://api.gsa.gov/systems/dap/agencies/veterans-affairs/reports/site/data?api_key=DEMO_KEY1))_

## Query params

The following query params are supported to work with the data:

- `limit`: Limit the number of data points that are rendered. The default is 1000 and the max is 10,000
- `page`: Pages through the results. If the limit is set to `1000`, using `page=2` will render the 1001st through 2000th data point.
