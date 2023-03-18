import React from "react";
import "./styles.css";
import { Input } from "../Input";
import moment from "moment";
import { Button } from "../Button";
import { onFilter } from "../../action/Filters";
import { connect } from "react-redux";
import toastMessage from "../../utils/toastMessage";

class DateRange extends React.Component {
  state = {
    fromDate: moment().subtract(30, "d").format("YYYY-MM-DD"),
    toDate: moment().add(1, "d").format("YYYY-MM-DD"),
    error: {},
  };

  componentDidMount() {
    const { filters } = this.props;

    if (filters.start_date && filters.end_date) {
      this.setState({ fromDate: filters.start_date, toDate: filters.end_date });
    } else {
      this.props.dispatch(
        onFilter({
          start_date: this.state.fromDate,
          end_date: this.state.toDate,
        })
      );
    }
  }

  onChangeText(name, e) {
    let { error } = this.state;

    delete error[name];

    this.setState({
      error,
      [name]: e.target.value,
    });
  }

  validateForm() {
    let { error, start_date, end_date } = this.state;

    if (start_date === "") {
      error.start_date = "Start date is required";
    }

    if (end_date === "") {
      error.end_date = "End date is required";
    }

    this.setState({
      error,
    });
  }

  handleApply() {
    const { fromDate, toDate } = this.state;
    if (fromDate && toDate) {
      this.props.dispatch(onFilter({ start_date: fromDate, end_date: toDate }));
    } else {
      toastMessage("error", "Wrong dates, please try again");
    }
  }

  handleResetDate() {
    this.setState({
      fromDate: moment().subtract(30, "d").format("YYYY-MM-DD"),
      toDate: moment().add(1, "d").format("YYYY-MM-DD"),
    });
  }

  render() {
    return (
      <form>
        <div className="card cdropdown-container">
          <div className="card-body">
            <Input
              label="Start Date:"
              required
              type="date"
              value={this.state.fromDate}
              error={this.state.error.fromDate}
              onChange={(e) => this.onChangeText("fromDate", e)}
            />
            <Input
              label="End Date:"
              required
              type="date"
              value={this.state.toDate}
              error={this.state.error.toDate}
              onChange={(e) => this.onChangeText("toDate", e)}
            />
            <div className="d-flex gap-3">
              <Button
                className="btn-default w-100 btn-lg"
                withOpacity
                text="Reset"
                onPress={this.handleResetDate.bind(this)}
              />
              <Button
                className="btn-primary w-100 btn-lg"
                withOpacity
                text="Apply"
                onPress={this.handleApply.bind(this)}
              />
            </div>
          </div>
        </div>
      </form>
    );
  }
}

const mapStateToProps = (state) => {
  const { filters } = state.Filters;

  return { filters };
};

export default connect(mapStateToProps)(DateRange);
