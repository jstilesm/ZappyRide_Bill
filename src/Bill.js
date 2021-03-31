import React from "react";

class Bill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rate: "A",
      miles: 0,
      start: 0,
      end: 0,
      bill: 0,
      change: "",
      data: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  update(field) {
    this.setState({ value: field.target.value });
  }

  handleSubmit() {
    // A rate
    let costA = 0.15;
    // B rate from 12-18
    let costB_first = 0.2;
    // B rate otherwise
    let costB_rest = 0.08;
    // Bill impact
    // B1 Electricity(Facility column) * by rate
    // B2 .3kWh * miles driven
    // Add together
    let EV_charge = 0.3 * this.state.miles;
  }
  render() {
    const { rate, miles, start, end, change, bill } = this.state;
    return (
      <div className="whole-page">
        <form onSubmit={this.handleSubmit}>
          <label>Rate:</label>
          <select value={rate} onChange={this.update} placeholder="A">
            <option value="A">A</option>
            <option value="B">B</option>
          </select>

          <label>Miles Driven:</label>
          <input type="number" value={miles} onChange={this.update} />

          <label>Range of Hours:</label>
          {/* 0-24 */}
          <input type="text" value={start} onChange={this.update} />
          <input type="text" value={end} onChange={this.update} />

          <button type="submit">Check your Impact</button>
        </form>
        <div>{bill}</div>
        <div>{change}</div>
      </div>
    );
  }
}

export default Bill;

// read csv file
// deploy on localhost
// computing cost
