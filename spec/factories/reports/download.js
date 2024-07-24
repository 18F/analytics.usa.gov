import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import ReportFactory from "../report";

const downloadReportDataItemFactory = Factory.define(({ sequence }) => {
  // ensure we get a new value for faker calls on each build of the factory.
  faker.seed(global.faker_seed + sequence);
  const item = {
    page_title: faker.company.buzzPhrase(),
    event_label: "file_download",
    file_name: faker.system.fileName(),
    page: faker.internet.url({ appendSlash: false }).replace("https://", ""),
    total_events: faker.number.int({ max: 10000 }),
  };
  faker.seed(global.faker_seed);
  return item;
});

const DownloadReportFactory = ReportFactory.params({
  query: {
    dimensions: [
      {
        name: "pageTitle",
      },
      {
        name: "eventName",
      },
      {
        name: "fileName",
      },
      {
        name: "fullPageUrl",
      },
    ],
    metrics: [
      {
        name: "eventCount",
      },
    ],
    dateRanges: [
      {
        startDate: "7daysAgo",
        endDate: "yesterday",
      },
    ],
    orderBys: [
      {
        metric: {
          metricName: "eventCount",
        },
        desc: true,
      },
    ],
    limit: 10000,
    property: "properties/123456",
  },
}).transient({ reportDataItemFactory: downloadReportDataItemFactory });

export default DownloadReportFactory;
