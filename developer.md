---
layout: developer
permalink: /developer/
---

# The analytics.usa.gov API

In addition to being published and available for download, the data generated for this site is also available via an API.

The host name for the API is `https://api.gsa.gov/systems/dap`, and it exposes 2 routes to query data:

- `/reports/<report name>/data`
- `/agencies/<agency name>/reports/<report name>/data`

## API Keys

To use the API, please register for [an API key](https://api.data.gov/signup/) and use an
You can register for an API key here.  

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

- devices
- browsers
- windows-ie
- windows-browsers
- device_model
- ie
- today
- os-browsers
- os
- windows
- screen-size
- language


## Filtering based on agencies

Reports can be queried by substituting `<agency name>` in the path with the name of the agency. If the path without an agency name parameter is used, the reports correspond to government wide data.

The list of valid agency names includes:

- agency-international-development
- agriculture
- commerce
- defense
- education
- energy
- environmental-protection-agency
- executive-office-president
- general-services-administration
- health-human-services
- homeland-security
- housing-urban-development
- interior
- justice
- labor
- national-aeronautics-space-administration
- national-archives-records-administration
- national-science-foundation
- nuclear-regulatory-commission
- office-personnel-management
- postal-service
- small-business-administration
- social-security-administration
- state
- transportation
- treasury
- veterans-affairs

## Query params

The following query params are supported to work with the data:

- `limit`: Limit the number of data points that are rendered. The default is 1000 and the max is 10,000
- `page`: Pages through the results. If the limit is set to `1000`, using `page=2` will render the 1001st through 2000th data point.
