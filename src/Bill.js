import React from "react";

class Bill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rate: 0,
      miles: 0,
      start: 0,
      end: 0,
      bill: 0,
      change: "",
      csv: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.csvdata = null;
  }
  async componentDidMount() {
    const response = await fetch("/USA_NY_Buffalo.725280_TMY2.csv");
    const reader = response.body.getReader();
    const result = await reader.read(); // raw array
    const decoder = new TextDecoder("utf-8");
    const csv = decoder.decode(result.value); // the csv text
    console.log(csv);
  }

  update(field) {
    this.setState({ value: field.target.value });
  }

  handleSubmit() {
    // e.preventDefault();
    // create a 2 value matrix containing the hour and the column vvalues of Electric:Facility
    let data = [
      [1, 0.925935588795078],
      [2, 0.798768278439017],
      [3, 0.753579623111327],
      [12, 1.15098689093821],
      [13, 1.11969897471791],
    ];

    // B1
    // take all column values of the csv "Electric-Faculty" and multiply it by this.state.rate

    // save added up value of entire column, save as total_usage
    let total_usage = 0;
    for (let i = 0; i < data.length; i++) {
      total_usage += data[i][1];
    }
    let B1 = total_usage * this.state.rate;

    // ----- rate A --------

    // A rate
    let A_cost = 0.15;
    let A_total = 0;
    for (let i = 0; i < data.length; i++) {
      A_total += data[i][1] * A_cost;
    }

    // ----- rate B --------

    // B rate from 12-18
    let B_cost_first = 0.2;
    // B rate otherwise
    let B_cost_rest = 0.08;

    let B_total = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] <= 18 && data[i][1] >= 12) {
        B_total += data[i][1] * B_cost_first;
      } else {
        B_total += data[i][1] * B_cost_rest;
      }
    }
    B_total += 0.3 * this.state.miles;
    A_total += 0.3 * this.state.miles;

    if (B1 < A_total && B1 < B_total) {
      this.setState({ change: "Stay with your current plan" });
      this.setState({ bill: 0 });
    } else if (A_total < B_total) {
      this.setState({ change: "Plan A is best" });
      this.setState({ bill: B1 - A_total });
    } else {
      this.setState({ change: "Plan B is best" });
      this.setState({ bill: B1 - B_total });
    }
  }
  render() {
    const { rate, miles, start, end, change, bill } = this.state;
    return (
      <div className="whole-page">
        <form onSubmit={this.handleSubmit}>
          <label>Rate:</label>
          <input type="number" value={rate} onChange={this.update}></input>

          <label>Miles Driven:</label>
          <input type="number" value={miles} onChange={this.update} />

          <label>Range of Hours:</label>
          {/* 0-24 */}
          <input type="text" value={start} onChange={this.update} />
          <input type="text" value={end} onChange={this.update} />

          <button type="submit">Check your Impact</button>
        </form>
        <div>What Plan Should You Use?{change}</div>
        <div>How Much Will You Save?{bill}</div>
      </div>
    );
  }
}

export default Bill;
