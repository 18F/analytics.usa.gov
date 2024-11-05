import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import ReportFactory from "../report";

const topPagesRealtimeReportDataItemFactory = Factory.define(({ sequence }) => {
  // ensure we get a new value for faker calls on each build of the factory.
  faker.seed(global.faker_seed + sequence);
  const item = {
    page_title: faker.company.buzzPhrase(),
    activeUsers: faker.number.int({ max: 100000 }),
  };
  faker.seed(global.faker_seed);
  return item;
});

const TopPagesRealtimeReportFactory = ReportFactory.params({
  query: {
    dimensions: [
      {
        name: "unifiedScreenName",
      },
    ],
    metrics: [
      {
        name: "activeUsers",
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
          metricName: "activeUsers",
        },
        desc: true,
      },
    ],
    limit: 30,
    property: "properties/123456",
  },
}).transient({
  reportDataItemFactory: topPagesRealtimeReportDataItemFactory,
  dataItemCount: 30,
});

export default TopPagesRealtimeReportFactory;
