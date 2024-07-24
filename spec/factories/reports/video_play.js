import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import ReportFactory from "../report";

const videoPlayReportDataItemFactory = Factory.define(({ sequence }) => {
  // ensure we get a new value for faker calls on each build of the factory.
  faker.seed(global.faker_seed + sequence);
  const item = {
    event_label: "video_start",
    video_title: faker.company.buzzPhrase(),
    video_url: faker.internet.url({ appendSlash: false }),
    total_events: faker.number.int({ max: 10000 }),
  };
  faker.seed(global.faker_seed);
  return item;
});

const DownloadReportFactory = ReportFactory.params({
  query: {
    dimensions: [
      {
        name: "eventName",
      },
      {
        name: "videoTitle",
      },
      {
        name: "videoUrl",
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
}).transient({ reportDataItemFactory: videoPlayReportDataItemFactory });

export default DownloadReportFactory;
