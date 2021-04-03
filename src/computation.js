// Transform's our csv into a useable array

export function transform_csv(data) {
  let information = [];
  for (let i = 0; i < data.length; i++) {
    let hour = data[i][0];
    let power = data[i][1];
    information.push([parseInt(hour.slice(8, 10)), parseFloat(power)]);
  }
  return information;
}

// Our main function for calculating the impact of having an EV in Plan's A and B

export function calc(rate, miles, start, end, data) {
  // ----- rate A --------

  let A_cost = 0.15;

  let A_rate_B1 = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] >= start && data[i][0] <= end) {
      A_rate_B1 += data[i][1] * A_cost;
    }
  }
  // ----- rate B --------

  // B rate from 12-18
  let B_cost_range = 0.2;
  // B rate otherwise
  let B_cost_rest = 0.08;

  let B_rate_B1 = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] >= start && data[i][0] <= end) {
      if (data[i][0] < 18 && data[i][0] >= 12) {
        B_rate_B1 += data[i][1] * B_cost_range;
      } else {
        B_rate_B1 += data[i][1] * B_cost_rest;
      }
    }
  }
  // Add up the EV load profile
  const EV_load_profile = 0.3 * miles;

  // compute EV cost for Plan B based on hours the user plans to charge
  let EV_load_profile_piece = EV_load_profile / (end - start);
  let B_EV_load_profile_cost = 0;
  for (let i = start; i < end; i++) {
    if (i >= 12 && i < 18) {
      B_EV_load_profile_cost += EV_load_profile_piece * B_cost_range;
    } else {
      B_EV_load_profile_cost += EV_load_profile_piece * B_cost_rest;
    }
  }
  // Set the current_plan cost value as our B1
  let B1 = 0;
  if (rate === "A") {
    B1 = A_rate_B1;
  } else {
    B1 = B_rate_B1;
  }

  // B2 - B1
  let A_Impact = A_rate_B1 + EV_load_profile * A_cost - B1;

  let B_Impact = B_rate_B1 + B_EV_load_profile_cost - B1;

  if (rate === "A") {
    if (A_Impact < B_Impact) {
      return [A_Impact, "Stay with your current plan, Plan A"];
    } else {
      return [A_Impact - B_Impact, "Plan B is best for you"];
    }
  }
  if (rate === "B") {
    if (B_Impact < A_Impact) {
      return [B_Impact, "Stay with your current plan, Plan B"];
    } else {
      return [B_Impact - A_Impact, "Plan A is best for you"];
    }
  }
}
