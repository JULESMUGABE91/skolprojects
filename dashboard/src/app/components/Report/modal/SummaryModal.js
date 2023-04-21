import React from "react";
import "../styles.css";
import { ENDPOINT } from "../../../constants/api";
import axios from "axios";
import toastMessage from "../../../utils/toastMessage";
import { getStorage } from "../../../utils/storage";
import filtersHandler from "../../../utils/filtersHandler";
import { LoadingSpinner } from "../../LoadingSpinner";
import moment from "moment";
import { connect } from "react-redux";
import { Button } from "../../Button";
import Gender from "../chart/Gender";
import Region from "../chart/Region";
import GroupAge from "../chart/GroupAge";

class SummaryModal extends React.Component {
  state = {
    error: {},
    isSubmitting: false,
    user: {},
    _id: "",
    data: [],
    limit: 10000,
    page: 1,
    fromDate: moment("2023-04-01").format("YYYY-MM-DD"),
    toDate: moment().add(1, "d").format("YYYY-MM-DD"),
    genderChart: [],
    ageGroupChart: [],
    regionChart: [],
    selected_item: {},
  };

  componentDidMount = async () => {
    await this.getUserLoggedInInfo();
  };

  getUserLoggedInInfo = async () => {
    const user = await getStorage();
    this.setState({
      user,
    });
  };

  render() {
    console.log(this.props);
    return (
      <div className="card">
        <div className="card-body">
          {this.state.isLoading ? (
            <LoadingSpinner />
          ) : (
            <div>
              {this.props.gender && (
                <div style={{ marginBottom: 15 }}>
                  <Gender
                    data={{
                      count: this.props.count,
                      gender: this.props.gender,
                    }}
                  />
                </div>
              )}
              {this.props.region && (
                <div style={{ marginBottom: 15 }}>
                  <Region
                    data={{
                      count: this.props.count,
                      region: this.props.region,
                    }}
                  />
                </div>
              )}
              {this.props.ageGroup && (
                <div style={{ marginBottom: 15 }}>
                  <GroupAge
                    data={{
                      count: this.props.count,
                      age: this.props.ageGroup,
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <hr />
        <div className="card-footer d-flex align-content-center justify-content-end gap-3">
          <Button
            text="Close"
            className="btn-default btn-lg border"
            onPress={this.props.handleCloseModal}
          />
        </div>
      </div>
    );
  }
}

const mapPropsToState = (state) => {
  const { filters } = state.Filters;
  return {
    filters,
  };
};

export default connect(mapPropsToState)(SummaryModal);
