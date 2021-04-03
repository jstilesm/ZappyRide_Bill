import React from "react";
import { calc, transform_csv } from "./computation";
import parse from "csv-parse/lib/sync";
import FormInput from "./FormInput";
import Grid from "./Grid";

class Bill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rate: "A",
      miles: 0,
      start: 0,
      end: 24,
      cost: "",
      message: "",
      csv: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.handleAClick = this.handleAClick.bind(this);
    this.handleBClick = this.handleBClick.bind(this);
  }

  // used async as opposed to chaining on a promise
  async componentDidMount() {
    const response = await fetch("/USA_NY_Buffalo.725280_TMY2.csv");
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder("utf-8");
    const csv = decoder.decode(result.value);
    let data = parse(csv).slice(1);
    const information = transform_csv(data);
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
    this.setState({ cost: "", message: "" });
  }

  handleAClick(e) {
    this.setState({ rate: "A" });
  }
  handleBClick(e) {
    this.setState({ rate: "B" });
  }

  formatCurrency(number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(number);
  }

  render() {
    const { rate, miles, start, end, message, cost } = this.state;

    if (this.state.csv === null) {
      return <div>Loading...</div>;
    }
    if (this.state.cost === "" && this.state.message === "") {
      return (
        <div>
          <div className="center title-text">
            <h2 className="title-header">Find the best EV rate for you</h2>
            <h3 className="title-header">Enter your information below </h3>
          </div>
          <div className="information-box">
            <form onSubmit={this.handleSubmit}>
              <Grid>
                <div>Your current rate: {rate}</div>
                <Grid.Row>
                  <Grid.Column>
                    <button
                      type="button"
                      onClick={this.handleAClick}
                      className="button"
                    >
                      Rate A
                    </button>
                  </Grid.Column>
                  <Grid.Column>
                    <button
                      type="button"
                      onClick={this.handleBClick}
                      className="button"
                    >
                      Rate B
                    </button>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <div className="subtext">Rate A is a flat $0.15/kWh</div>
                  </Grid.Column>
                  <Grid.Column>
                    <div className="subtext">
                      Rate B is a time-of-use rate of $0.20/kWh between noon and
                      6pm, and $0.08/kWh otherwise
                    </div>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <FormInput
                      label="Miles You Plan to Drive in a Year:"
                      type="number"
                      min="0"
                      value={miles}
                      onChange={this.update("miles")}
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <label>Range of hours you plan to charge your EV:</label>
                  </Grid.Column>
                </Grid.Row>
                {/* 0-24 */}
                <Grid.Row>
                  <Grid.Column>
                    <FormInput
                      type="number"
                      min="0"
                      max="24"
                      value={start}
                      onChange={this.update("start")}
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <FormInput
                      type="number"
                      min="0"
                      max="24"
                      value={end}
                      onChange={this.update("end")}
                    />
                  </Grid.Column>
                </Grid.Row>

                <button className="button" type="submit">
                  Check Your Impact
                </button>
              </Grid>
            </form>
          </div>
        </div>
      );
    }
    return (
      <div className="center">
        <div className="savings-box">
          <div className="message">{message}</div>

          {this.state.message.slice(-3) === "you" && (
            <div>If you switch you can save: {this.formatCurrency(cost)}</div>
          )}
          {this.state.message.slice(-3) !== "you" && (
            <div>
              Having an electronic vechicle adds {this.formatCurrency(cost)} to
              your Bill
            </div>
          )}
        </div>

        <button onClick={this.handleResetClick} className="button">
          Try Another Rate
        </button>
      </div>
    );
  }
}

export default Bill;
