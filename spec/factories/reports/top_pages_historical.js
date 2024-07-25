import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import ReportFactory from "../report";

const topPagesHistoricalReportDataItemFactory = Factory.define(
  ({ sequence }) => {
    // ensure we get a new value for faker calls on each build of the factory.
    faker.seed(global.faker_seed + sequence);
    const item = {
      domain: faker.internet
        .url({ appendSlash: false })
        .replace("https://", ""),
      visits: faker.number.int({ max: 1000000 }),
    };
    faker.seed(global.faker_seed);
    return item;
  },
);

const TopPagesHistoricalReportFactory = ReportFactory.params({
  query: {
    dimensions: [
      {
        name: "hostName",
      },
    ],
    metrics: [
      {
        name: "sessions",
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
          metricName: "sessions",
        },
        desc: true,
      },
    ],
    limit: 30,
    property: "properties/123456",
  },
}).transient({
  reportDataItemFactory: topPagesHistoricalReportDataItemFactory,
  dataItemCount: 30,
});

export default TopPagesHistoricalReportFactory;
