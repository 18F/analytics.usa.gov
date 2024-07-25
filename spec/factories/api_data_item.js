import { Factory } from "fishery";
import { faker } from "@faker-js/faker";

const ApiDataItemFactory = Factory.define(({ sequence }) => {
  // Makes a new call to faker each time the factory is used
  const dynamicParams = {
    date: faker.date.past().toISOString(),
    report_name: faker.commerce.productAdjective(),
    report_agency: faker.company.buzzNoun(),
    visits: faker.number.int({ max: 10000 }),
  };
  return {
    notice: "api v1 is being deprecated, use api v2",
    id: sequence,
    ...dynamicParams,
  };
});

export default ApiDataItemFactory;
