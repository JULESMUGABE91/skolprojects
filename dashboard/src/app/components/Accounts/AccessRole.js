import React from "react";

import { ENDPOINT } from "../../constants/api";
import axios from "axios";
import toastMessage from "../../utils/toastMessage";
import { getStorage } from "../../utils/storage";
import { menus } from "../../constants/sidebar-menus";
import { Button } from "../Button";
import { Select } from "../Input";

class AccessRole extends React.Component {
  state = {
    email: "",
    password: "",
    error: {},
    isSubmitting: false,
    user: {},
    id: "",
    access_role: {},
    read_role: undefined,
    write_role: undefined,
    update_role: undefined,
    delete_role: undefined,
    isSameAccount: false,
  };

  componentDidMount = async () => {
    await this.getUserLoggedInInfo();

    const { access_role } = this.props;

    this.populateFromProps(access_role);
  };

  populateFromProps(access_role) {
    let from_props_data = {
      denied_menus: access_role.denied_menu,
      read_role: {
        label: access_role.action_rights.read,
        value: access_role.action_rights.read,
      },
      write_role: {
        label: access_role.action_rights.write,
        value: access_role.action_rights.write,
      },
      update_role: {
        label: access_role.action_rights.update,
        value: access_role.action_rights.update,
      },
      delete_role: {
        label: access_role.action_rights.delete,
        value: access_role.action_rights.delete,
      },
    };

    this.setState({
      ...from_props_data,
    });
  }

  getUserLoggedInInfo = async () => {
    const user = await getStorage();
    this.setState({
      user,
    });
  };

  onChangeText(name, e) {
    let error = this.state.error;
    let value = e.target ? e.target.value : e;

    delete error[name];

    this.setState({
      error,
      [name]: value,
    });
  }

  onAddRole() {
    let {
      read_role,
      write_role,
      update_role,
      delete_role,
      user,
      denied_menus,
    } = this.state;

    let { _id } = this.props;

    let url = "";

    if (user.account_type === "admin_account" && _id !== "") {
      url = ENDPOINT + "/update_user_account";
    }

    if (user.account_type === "user_account" && _id !== "") {
      url = ENDPOINT + "/update_user_subaccount";
    }

    this.setState({
      isSubmitting: true,
    });

    let data = {
      id: _id,
      access_role: {
        denied_menu: denied_menus,
        action_rights: {
          read: read_role.value,
          update: update_role.value,
          delete: delete_role.value,
          write: write_role.value,
        },
      },
    };

    const options = {
      method: "POST",
      url,
      data,
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((data) => {
        this.setState({
          isSubmitting: false,
        });

        toastMessage("success", "Account access level updated ");

        this.props.getAccounts(true);
      })
      .catch((error) => {
        this.setState({
          isSubmitting: false,
        });

        toastMessage("error", error);
      });
  }

  formattedMenus(sub_m) {
    let m = [];

    for (let i = 0; i < sub_m.length; i++) {
      m.push({
        label: sub_m[i].group + " / " + sub_m[i].name,
        value: sub_m[i].group + "/" + sub_m[i].name,
      });
    }

    return m;
  }

  render() {
    const sub_menus = [].concat(...menus.map(({ items }) => items || []));
    let formatted_menus = this.formattedMenus(sub_menus);
    return (
      <div className="card">
        <div className="card-body">
          <Select
            label="Denied Menus"
            options={formatted_menus}
            onChange={(e) => this.onChangeText("denied_menus", e)}
            isMulti
            isDisabled={
              this.state.user.account_type !== "admin_account" &&
              this.state.user.id === this.props.id
            }
            value={this.state.denied_menus}
          />
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Read</th>
                  <th>Write</th>
                  <th>Update</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Select
                      options={[
                        {
                          label: "true",
                          value: "true",
                        },
                        {
                          label: "false",
                          value: "false",
                        },
                      ]}
                      isDisabled={
                        this.state.user.account_type !== "admin_account" &&
                        this.state.user.id === this.props.id
                      }
                      value={this.state.read_role}
                      onChange={(e) => this.onChangeText("read_role", e)}
                    />
                  </td>
                  <td>
                    <Select
                      options={[
                        {
                          label: "true",
                          value: "true",
                        },
                        {
                          label: "false",
                          value: "false",
                        },
                      ]}
                      isDisabled={
                        this.state.user.account_type !== "admin_account" &&
                        this.state.user.id === this.props.id
                      }
                      value={this.state.write_role}
                      onChange={(e) => this.onChangeText("write_role", e)}
                    />
                  </td>
                  <td>
                    <Select
                      options={[
                        {
                          label: "true",
                          value: "true",
                        },
                        {
                          label: "false",
                          value: "false",
                        },
                      ]}
                      isDisabled={
                        this.state.user.account_type !== "admin_account" &&
                        this.state.user.id === this.props.id
                      }
                      value={this.state.update_role}
                      onChange={(e) => this.onChangeText("update_role", e)}
                    />
                  </td>
                  <td>
                    <Select
                      options={[
                        {
                          label: "true",
                          value: "true",
                        },
                        {
                          label: "false",
                          value: "false",
                        },
                      ]}
                      isDisabled={
                        this.state.user.account_type !== "admin_account" &&
                        this.state.user.id === this.props.id
                      }
                      value={this.state.delete_role}
                      onChange={(e) => this.onChangeText("delete_role", e)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {(this.state.user.account_type === "admin_account" ||
          this.state.user.id !== this.props.id) && (
          <>
            <hr />
            <div className="card-footer d-flex align-content-center justify-content-end gap-3">
              <Button
                text="Close"
                className="btn-default btn-lg border"
                onPress={this.props.handleCloseModal}
              />
              <Button
                isSubmitting={this.state.isSubmitting}
                text="Submit"
                className="btn-primary btn-lg"
                onPress={this.onAddRole.bind(this)}
              />
            </div>
          </>
        )}
      </div>
    );
  }
}

export default AccessRole;
