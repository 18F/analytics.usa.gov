import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import ReportFactory from "../report";

const CitiesReportDataItemFactory = Factory.define(({ sequence }) => {
  // ensure we get a new value for faker calls on each build of the factory.
  faker.seed(global.faker_seed + sequence);
  const item = {
    city: faker.location.city(),
    activeUsers: faker.number.int({ max: 1000000 }),
  };
  faker.seed(global.faker_seed);
  return item;
});

const CitiesReportFactory = ReportFactory.params({
  query: {
    dimensions: [
      {
        name: "city",
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
    limit: 10000,
    property: "properties/123456",
  },
}).transient({
  reportDataItemFactory: CitiesReportDataItemFactory,
  dataItemCount: 10,
});

export default CitiesReportFactory;
