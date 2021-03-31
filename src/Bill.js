import React from "react";
import calc from "./calc";
import parse from "csv-parse/lib/sync";
// const parse = require("csv-parse/lib/sync");

class Bill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rate: 0,
      miles: 0,
      start: 0,
      end: 0,
      cost: "",
      message: "",
      csv: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.csvdata = null;
  }
  async componentDidMount() {
    const response = await fetch("/USA_NY_Buffalo.725280_TMY2.csv");
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder("utf-8");
    const csv = decoder.decode(result.value);
    this.setState({ csv: parse(csv).slice(1) });
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
    const [cost, message] = calc(this.state.rate, this.state.miles, data);

    this.setState({ cost: cost, message: message });
  }

  render() {
    if (this.state.csv === null) {
      return <div>Loading...</div>;
    }
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
