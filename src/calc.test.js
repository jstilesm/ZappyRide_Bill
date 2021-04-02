import calc from "./calc";
import parse from "csv-parse/lib/sync";
const data = [
  [1, 0.925935588795078],
  [2, 0.798768278439017],
  [3, 0.753579623111327],
  [12, 1.15098689093821],
  [13, 1.11969897471791],
];

test("Cost to be 0", () => {
  const [cost, message] = calc(0, 0, 0, 24, data);
  expect(cost).toBe(0);
  expect(message).toBe("Stay with your current plan");
});
test("Stay with Current Plan", () => {
  const [cost, message] = calc(0.7, 20, 0, 24, data);
  expect(cost).toBe(0);
  expect(message).toBe("Stay with your current plan");
});
test("Plan A is Best", () => {
  const [cost, message] = calc(1.5, 0, 12, 13, data);
  expect(cost).toBe(6.782851154153895);
  expect(message).toBe("Plan A is best");
});
test("Plan B is Best", () => {
  const [cost, message] = calc(1.5, 20, 0, 3, data);
  expect(cost).toBe(0.9251913547746788);
  expect(message).toBe("Plan B is best");
});

test("Miles affects the outcome", () => {
  const [cost, message] = calc(1.5, 200000, 0, 3, data);
  expect(message).toBe("Stay with your current plan");
});
