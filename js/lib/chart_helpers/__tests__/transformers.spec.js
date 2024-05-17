import assert from "assert";
import transformers from "../transformers";

describe("transformers", () => {
  const sampleArray = [
    { key: "bob", value: 1000 },
    { key: "harry", value: 300 },
    { key: "tom", value: 2 },
  ];

  const proportionArray = [
    { key: "bob", value: 1000, proportion: 76.80491551459293 },
    { key: "harry", value: 300, proportion: 23.04147465437788 },
    { key: "tom", value: 2, proportion: 0.15360983102918588 },
  ];
  describe("listify", () => {
    it("order a list by its key value pairs", () => {
      assert.deepEqual(
        transformers.listify({ bob: 1000, tom: 2, harry: 300 }),
        sampleArray,
      );
    });
  });

  describe("extractArrayValue", () => {
    it("should take an list of objects with the each with keys value and return an arry of values", () => {
      assert.deepEqual(
        transformers.extractArrayValue(sampleArray),
        [1000, 300, 2],
      );
    });

    it("should will include an undefined when not all list items have a value key", () => {
      const badArray = [
        { key: "bob", value: 1000 },
        { key: "harry", toons: 300 },
        { key: "tom", value: 2 },
      ];
      assert.deepEqual(transformers.extractArrayValue(badArray), [
        1000,
        undefined,
        2,
      ]);
    });

    it("will error if just an object", () => {
      const badObject = { key: "bob", value: 1000 };
      assert.throws(() => {
        transformers.extractArrayValue(badObject);
      }, TypeError);
    });
  });

  describe("findProportionsOfMetric", () => {
    it("given a list of objects with some sort of numeric value, return a new list wth the orignal data and the % of the total numeric values", () => {
      function sampleArrayExtract(list) {
        return list.map((item) => item.value);
      }
      assert.deepEqual(
        transformers.findProportionsOfMetric(sampleArray, sampleArrayExtract),
        proportionArray,
      );
    });
  });

  describe("findProportionsOfMetricFromValue", () => {
    it("given a list of objects with some sort of numeric value, return a new list wth the orignal data and the % of the total numeric values", () => {
      assert.deepEqual(
        transformers.findProportionsOfMetricFromValue(sampleArray),
        proportionArray,
      );
    });
  });

  describe("consolidateSmallValues", () => {
    it("does nothing to values that are all greater than the given hold", () => {
      proportionArray[2].proportion = 1.5;
      proportionArray.push({ key: "Other", proportion: 0, children: [] });
      assert.deepEqual(
        transformers.consolidateSmallValues(proportionArray, 1),
        proportionArray,
      );
    });

    it("will group all values below a certain threshold", () => {
      const proportionArraySmall = [
        { key: "bob", value: 1000, proportion: 76.8 },
        { key: "harry", value: 300, proportion: 23.0 },
        { key: "tom", value: 2, proportion: 0.0015 },
        { key: "minnie", value: 2, proportion: 0.0025 },
      ];

      const proportionArrayResult = [
        { key: "bob", value: 1000, proportion: 76.8 },
        { key: "harry", value: 300, proportion: 23.0 },
        { key: "Other", proportion: 0.004, children: [] },
      ];
      assert.deepEqual(
        transformers.consolidateSmallValues(proportionArraySmall, 1),
        proportionArrayResult,
      );
    });
  });

  describe("toTopPercents", () => {
    it("returns the top percents given some data", () => {
      const resultsArray = [
        { key: "bob", value: 1000, proportion: 76.92189350933063 },
        { key: "harry", value: 300, proportion: 23.07656805279919 },
        { key: "Other", proportion: 0.0015384378701866124, children: [] },
      ];

      assert.deepEqual(
        transformers.toTopPercents(
          { totals: { by_os: { bob: 1000, tom: 0.02, harry: 300 } } },
          "os",
        ),
        resultsArray,
      );
    });
  });
});
