import calc from "./calc";

const data = [
  [1, 0.925935588795078],
  [2, 0.798768278439017],
  [3, 0.753579623111327],
  [12, 1.15098689093821],
  [13, 1.11969897471791],
];
test("Test Basic information", () => {
  const [cost, message] = calc(0, 0, data);
  expect(cost).toBe(0);
});
test("Test 2 Basic information", () => {
  const [cost, message] = calc(0.6, 24322234, data);
  expect(cost).toBe(1);
});
