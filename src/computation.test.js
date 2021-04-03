import { calc, transform_csv } from "./computation";
import parse from "csv-parse/lib/sync";
import fs from "fs";

const data = [
  [1, 0.925935588795078],
  [2, 0.798768278439017],
  [3, 0.753579623111327],
  [12, 1.15098689093821],
  [13, 1.11969897471791],
];

const csv = fs.readFileSync("./public/USA_NY_Buffalo.725280_TMY2.csv");
const csv_data = parse(csv).slice(1);
const bulk_data = transform_csv(csv_data);

test("Bulk Data is input correctly", () => {
  const [cost, message] = calc("A", 0, 0, 24, bulk_data);
  expect(cost).toBe(382.30865323670673);
  expect(message).toBe("Plan B is best for you");
});
test("Cost to be 0", () => {
  const [cost, message] = calc("B", 0, 0, 24, data);
  expect(cost).toBe(0);
  expect(message).toBe("Stay with your current plan, Plan B");
});
test("Stay with Current Plan", () => {
  const [cost, message] = calc("B", 2000, 0, 24, data);
  expect(cost).toBe(66);
  expect(message).toBe("Stay with your current plan, Plan B");
});
test("Plan A is Best", () => {
  const [cost, message] = calc("B", 0, 12, 13, data);
  expect(cost).toBe(0.11353429328280606);
  expect(message).toBe("Plan A is best for you");
});
test("Plan B is Best", () => {
  const [cost, message] = calc("A", 20, 0, 4, data);
  expect(cost).toBe(0.5934798443241794);
  expect(message).toBe("Plan B is best for you");
});

test("Miles affects the outcome", () => {
  const [cost, message] = calc("B", 200000, 0, 3, data);
  expect(message).toBe("Stay with your current plan, Plan B");
});
