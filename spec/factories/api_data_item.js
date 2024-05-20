// factories/user.ts
import { Factory } from "fishery";
import { faker } from "@faker-js/faker";

const apiDataItemFactory = Factory.define(({ sequence }) => ({
  notice: "api v1 is being deprecated, use api v2",
  id: sequence,
  date: faker.date.past().toISOString(),
  report: faker.commerce.productAdjective(),
  agency: faker.company.buzzNoun(),
  visits: faker.number.int({ max: 10000 }),
}));

export default apiDataItemFactory;
