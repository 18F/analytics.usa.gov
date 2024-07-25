import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import ReportFactory from "../report";

const CountriesReportDataItemFactory = Factory.define(({ sequence }) => {
  // ensure we get a new value for faker calls on each build of the factory.
  faker.seed(global.faker_seed + sequence);
  const item = {
    country: faker.location.country(),
    active_visitors: faker.number.int({ max: 10000 }),
  };
  if (item.country == "United States of America") {
    item.country = "United States";
  }
  faker.seed(global.faker_seed);
  return item;
});

const CountriesReportFactory = ReportFactory.params({
  query: {
    dimensions: [
      {
        name: "country",
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
  reportDataItemFactory: CountriesReportDataItemFactory,
  dataItemCount: 20,
});

export default CountriesReportFactory;
