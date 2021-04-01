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
      end: 24,
      cost: "",
      message: "",
      csv: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleResetClick = this.handleResetClick(this);
  }
  async componentDidMount() {
    const response = await fetch("/USA_NY_Buffalo.725280_TMY2.csv");
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder("utf-8");
    const csv = decoder.decode(result.value);
    let data = parse(csv).slice(1);
    let information = [];
    for (let i = 0; i < data.length; i++) {
      let hour = data[i][0];
      let power = data[i][1];
      information.push([parseInt(hour.slice(8, 10)), parseFloat(power)]);
    }
    this.setState({ csv: information });
  }

  update(field) {
    return (e) => this.setState({ [field]: e.currentTarget.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const [cost, message] = calc(
      this.state.rate,
      this.state.miles,
      this.state.start,
      this.state.end,
      this.state.csv
    );

    this.setState({ cost: cost, message: message });
  }
  handleResetClick(e) {
    // e.preventDefault();
    this.setState({ cost: "", message: "" });
  }

  render() {
    const { rate, miles, start, end, message, cost } = this.state;

    if (this.state.csv === null) {
      return <div>Loading...</div>;
    }
    if (this.state.cost === "" && this.state.message === "") {
      return (
        <div className="whole-page">
          <h2>Find the best EV rate for you.</h2>
          <h3>Enter your Information below </h3>
          <form onSubmit={this.handleSubmit}>
            <div className="information-box">
              <label className="labels">Your Current Rate ($/kWh):</label>
              <input
                className="inputs"
                type="number"
                // value={rate}
                step=".01"
                onChange={this.update("rate")}
              />
              <br></br>
              <label className="labels">
                Miles Your Plan to Drive in a Year:
              </label>
              <input
                className="inputs"
                type="number"
                // value={miles}
                onChange={this.update("miles")}
              />
              <br></br>
              <label className="labels">
                Range of Hours You Plan to Charge:
              </label>
              {/* 0-24 */}
              <div>
                <input
                  className="inputs"
                  type="number"
                  value={start}
                  onChange={this.update("start")}
                  // placeholder="start"
                />
                <input
                  className="inputs"
                  type="number"
                  value={end}
                  // placeholder="end"
                  onChange={this.update("end")}
                />
              </div>
            </div>

            <button className="button" type="submit">
              Check your Impact
            </button>
          </form>
        </div>
      );
    } else if (this.state.cost === 0) {
      return (
        <div className="savings-box">
          <div className="message">{message}</div>
          <button onClick={this.handleResetClick} className="button">
            Try Another Rate
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <div className="savings-box">
            <div className="message">{message}</div>

            <div className>You Can Save: ${cost}</div>
          </div>
          <button onClick={this.handleResetClick} className="button">
            Try Another Rate
          </button>
        </div>
      );
    }
  }
}

export default Bill;
