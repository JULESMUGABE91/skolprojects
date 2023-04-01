import React from "react";
import "./styles.css";
import { Checkbox, Input, Select } from "../Input";
import axios from "axios";
import { ENDPOINT } from "../../constants/api";
import toastMessage from "../../utils/toastMessage";
import { getStorage } from "../../utils/storage";
import { LoadingSpinner } from "../LoadingSpinner";
import { onFilter } from "../../action/Filters";
import rwanda from "../../assets/rwanda.json";
import { connect } from "react-redux";
import { Button } from "../Button";

let copyAccounts = [];

class Location extends React.Component {
  state = {
    isLoading: false,
    accounts: [],
    error: {},
    selected_account: [],
  };

  componentDidMount = async () => {
    await this.getUserLoggedInInfo();

    this.getAccounts(true);
  };

  componentDidUpdate = async (prevProps) => {
    if (prevProps.filters.organization !== this.props.filters.organization) {
      this.getAccounts(true);
    }
  };

  getUserLoggedInInfo = async () => {
    const user = await getStorage();
    this.setState({
      user,
    });
  };

  returnFilters() {
    let request_body = {};

    if (this.props?.filters && this.props?.filters?.organization) {
      request_body.organization = this.props?.filters?.organization.value;
    }

    return request_body;
  }

  getAccounts(isLoading) {
    const { user } = this.state;

    this.setState({
      isLoading,
    });

    let url = ENDPOINT + "/user/fetch";

    const options = {
      method: "POST",
      url,
      data: {
        ...this.returnFilters(),
      },
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        this.setState({
          accounts: res.data,
          isLoading: false,
        });

        copyAccounts = res.data.slice(0);
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });

        toastMessage("error", error);
      });
  }

  handleCheck(item) {
    this.props.dispatch(
      onFilter({
        user: { label: item.firstname + " " + item.lastname, value: item._id },
      })
    );
  }

  handleSearch(e) {
    const search_text = e.target.value;

    this.setState({ search_text });

    let array = [];

    for (let i = 0; i < copyAccounts.length; i++) {
      if (
        JSON.stringify(copyAccounts[i])
          .toUpperCase()
          .indexOf(search_text.toUpperCase()) !== -1
      ) {
        array.push(copyAccounts[i]);
      }
    }
    this.setState({
      accounts: array,
    });
  }

  onResetCheck() {
    this.props.dispatch(onFilter({ user: {} }));

    this.setState({ selected_account: [] });
  }

  render() {
    return (
      <form>
        <div className="card cdropdown-container">
          <div className="card-body">
            <Input
              placeholder="Search username..."
              className="form-control-sm"
              value={this.state.search_text}
              onChange={this.handleSearch.bind(this)}
            />
            {this.state.isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  className="cdropdown-content"
                >
                  <h1 className="separator-title">Accounts</h1>
                  {this.props.filters &&
                    this.props.filters.user &&
                    this.props.filters.user.value && (
                      <a
                        href="#"
                        className="text-danger"
                        onClick={this.onResetCheck.bind(this)}
                      >
                        <b>{`Clear`}</b>
                      </a>
                    )}
                </div>
                {this.state.accounts.map((item, i) => {
                  return (
                    <div className="cdropdown-item" key={i}>
                      <Checkbox
                        name={item.email}
                        handleCheck={() => this.handleCheck(item)}
                        checked={item._id === this.props?.filters?.user?.value}
                      />
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </form>
    );
  }
}

const mapStateToProps = (state) => {
  const { filters } = state.Filters;
  return {
    filters,
  };
};

export default connect(mapStateToProps)(Location);
