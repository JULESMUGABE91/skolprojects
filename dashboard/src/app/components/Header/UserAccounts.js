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

  getUserLoggedInInfo = async () => {
    const user = await getStorage();
    this.setState({
      user,
    });
  };

  getAccounts(isLoading) {
    const { user } = this.state;

    this.setState({
      isLoading,
    });

    let url = "",
      body = {};

    if (user.account_type === "user_account") {
      url = ENDPOINT + "/get_user_subaccount";

      body.user_id = [user.id];
      body.ref_account = [user.id];
    }

    if (user.account_type === "admin_account") {
      url = ENDPOINT + "/get_user_account";
    }

    const options = {
      method: "POST",
      url,
      data: {
        ...body,
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
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });

        toastMessage("error", error);
      });
  }

  handleCheck(location) {
    let selected_account = this.state.selected_account;

    let index = selected_account.indexOf(location);

    if (index !== -1) {
      selected_account.splice(index, 1);
    } else {
      selected_account.push(location);
    }
    this.setState(
      {
        selected_account,
      },
      () => {
        this.props.dispatch(onFilter({ users: selected_account }));
      }
    );
  }

  handleSearch(e) {
    const search_text = e.target.value;

    this.setState({ search_text });

    let array = [];

    for (let i = 0; i < copyAccounts.length; i++) {
      if (
        copyAccounts[i].toUpperCase().indexOf(search_text.toUpperCase()) !== -1
      ) {
        array.push(copyAccounts[i]);
      }
    }

    this.setState({
      recent_location: array,
    });
  }

  onResetCheck() {
    this.props.dispatch(onFilter({ locations: [] }));

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
                  {/* {this.props.filters &&
                    this.props.filters.locations &&
                    this.props.filters.locations.length > 0 && (
                      <a
                        href="#"
                        className="text-danger"
                        onClick={this.onResetCheck.bind(this)}
                      >
                        <b>{`Clear (${this.props.filters.locations.length})`}</b>
                      </a>
                    )} */}
                </div>
                {this.state.accounts.map((item, i) => {
                  return (
                    <div className="cdropdown-item" key={i}>
                      <Checkbox
                        name={item.email}
                        handleCheck={this.handleCheck.bind(this, item.email)}
                        checked={this.state.selected_account.includes(
                          item.email
                        )}
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
