import React from "react";
import "./styles.css";
import { Checkbox, Input } from "../Input";
import axios from "axios";
import { ENDPOINT } from "../../constants/api";
import toastMessage from "../../utils/toastMessage";
import { getStorage } from "../../utils/storage";
import { LoadingSpinner } from "../LoadingSpinner";
import { onFilter } from "../../action/Filters";
import { connect } from "react-redux";

let copyData = [];

class Organization extends React.Component {
  state = {
    data: [],
    selected_item: [],
    isLoading: false,
  };

  componentDidMount = async () => {
    await this.getUserLoggedInInfo();

    this.getData(true);
  };

  getUserLoggedInInfo = async () => {
    const user = await getStorage();
    this.setState({
      user,
    });
  };

  returnFilters() {
    let request_body = {},
      { user } = this.state;

    if (
      user.account_type !== "super_admin" &&
      this.props?.filters &&
      this.props?.filters?.organization
    ) {
      request_body.id = this.props?.filters?.organization.value;
    }

    return request_body;
  }

  getData(isLoading) {
    const { user } = this.state;

    this.setState({
      isLoading,
    });

    let url = ENDPOINT + "/organization";

    const options = {
      method: "GET",
      url,
      params: { ...this.returnFilters() },
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        let data = res.data;

        if (!data) {
          data = res.data;
        }
        this.setState({
          data,
          isLoading: false,
        });

        if (data.length !== 0) {
          copyData = data.slice(0);
        }
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
      onFilter({ organization: { label: item.name, value: item._id } })
    );
  }

  handleSearch(e) {
    const search_text = e.target.value;

    this.setState({ search_text });

    let array = [];

    for (let i = 0; i < copyData.length; i++) {
      if (copyData[i].toUpperCase().indexOf(search_text.toUpperCase()) !== -1) {
        array.push(copyData[i]);
      }
    }

    this.setState({
      data: array,
    });
  }

  onResetCheck() {
    this.props.dispatch(onFilter({ organization: [] }));

    this.setState({
      selected_item: [],
      search_text: "",
      data: copyData,
    });
  }

  render() {
    return (
      <div className="card cdropdown-container">
        <div className="card-body">
          <Input
            placeholder="Search..."
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
                <h1 className="separator-title">Organization</h1>
                {this.props.filters &&
                  this.props.filters.organization &&
                  this.props.filters.organization.length > 0 && (
                    <a
                      href="#"
                      className="text-danger"
                      onClick={this.onResetCheck.bind(this)}
                    >
                      <b>{`Clear (${this.props.filters.organization.length})`}</b>
                    </a>
                  )}
              </div>
              {this.state.data.map((item, i) => {
                return (
                  <div className="cdropdown-item" key={i}>
                    <Checkbox
                      name={item.name}
                      handleCheck={this.handleCheck.bind(this, item)}
                      checked={
                        this.props.filters?.organization?.value === item._id
                      }
                    />
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { filters } = state.Filters;
  return {
    filters,
  };
};

export default connect(mapStateToProps)(Organization);
