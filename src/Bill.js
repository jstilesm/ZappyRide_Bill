import React from "react";
import calc from "./calc";
import parse from "csv-parse/lib/sync";
import FormInput from "./FormInput";
import Grid from "./Grid";

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
    this.handleResetClick = this.handleResetClick.bind(this);
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
    if (field === "start" || field === "end") {
      if (this.state.start < this.state.end) {
        return (e) => this.setState({ [field]: e.currentTarget.value });
      }
    }
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

  formatCurrency(number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(number);
  }

  render() {
    console.log(this.state);
    const { rate, miles, start, end, message, cost } = this.state;

    if (this.state.csv === null) {
      return <div>Loading...</div>;
    }
    if (this.state.cost === "" && this.state.message === "") {
      return (
        <div>
          <div className="center title-text">
            <h2>Find the best EV rate for you</h2>
            <h3>Enter your Information below </h3>
          </div>
          <div className="information-box">
            <form onSubmit={this.handleSubmit}>
              <Grid>
                <Grid.Row>
                  <Grid.Column>
                    <FormInput
                      label="Your Current Rate ($/kWh):"
                      type="number"
                      min="0"
                      value={rate}
                      step=".01"
                      onChange={this.update("rate")}
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <FormInput
                      label="Miles Your Plan to Drive in a Year:"
                      type="number"
                      min="0"
                      value={miles}
                      onChange={this.update("miles")}
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <label>Range of Hours You Plan to Charge:</label>
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
                  Check your Impact
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
          {this.state.cost !== 0 && (
            <div>You Can Save: {this.formatCurrency(cost)}</div>
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
