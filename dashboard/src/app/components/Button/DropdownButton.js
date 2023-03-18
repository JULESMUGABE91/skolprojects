import React from "react";
import "./styles.css";
import DropdownContent from "./DropdownContent";

class DropdownButton extends React.Component {
  constructor() {
    super();

    this.state = {
      isOpen: false,
    };

    this.search_drop_ref = React.createRef();
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside.bind(this));

    const { isOpen, handleCloseDropdown } = this.props;
    if (isOpen) {
      this.setState({ isOpen });
    }
  }

  componentDidUpdate(nxtProps) {
    if (this.props.isOpen !== nxtProps.isOpen) {
      this.setState({ isOpen: nxtProps.isOpen });
    }
  }

  componentWillUnmount() {
    document.removeEventListener(
      "mousedown",
      this.handleClickOutside.bind(this)
    );
  }

  handleClickOutside(e) {
    if (
      this.search_drop_ref &&
      this.search_drop_ref.current &&
      !this.search_drop_ref.current.contains(e.target)
    ) {
      this.setState({
        isOpen: false,
      });
    }
  }

  handleOpen() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  onSelectDropdownItem(item) {
    if (this.props.isMulti) {
      let default_key = this.props.default_key
        ? this.props.default_key
        : "value";

      let new_item = this.props.selected_item;
      if (!this.props.selected_item.includes(item[default_key])) {
        new_item.push(item[default_key]);
      } else {
        new_item.splice(new_item.indexOf(item[default_key]), 1);
      }
      this.props.onSelectDropdownItem(new_item);

      return;
    }

    this.props.onSelectDropdownItem(item);

    this.setState({
      isOpen: false,
    });
  }

  onReset() {
    if (this.props.isMulti) {
      this.props.onSelectDropdownItem([]);
    } else {
      this.props.onSelectDropdownItem({});
    }

    this.props.handleReset && this.props.handleReset();

    this.setState({
      isOpen: false,
    });
  }

  returnLabel(value) {
    let label = "",
      data = this.props.options ? this.props.options : [];

    for (let i = 0; i < data.length; i++) {
      if (data[i].value === value || data[i].label === value) {
        label = data[i].label;
        break;
      }
    }

    return label;
  }
  render() {
    let props = this.props;
    let title = "";

    if (props.selected_item) {
      if (props.isMulti) {
        title = this.returnLabel(props.selected_item[0]);
        // props.selected_item[0];

        if (props.selected_item.length >= 2) {
          title += "(+" + Number(props.selected_item.length - 1) + ")";
        }
      } else {
        title = props.selected_item
          ? this.returnLabel(props.selected_item.value)
          : "All";
      }
    }

    return (
      <>
        <div className="dropdown " style={{ position: "initial" }}>
          <button
            className={`btn dropdown-toggle dropdown-toggle-split ${
              props.className
            } ${props.isSubmitting && "btn-disabled"}`}
            id={props.id ? props.id : "dropdownMenuButton1"}
            data-bs-toggle="dropdown"
            aria-expanded="false"
            data-bs-auto-close="outside"
          >
            <div
              onClick={this.handleOpen.bind(this)}
              style={{ display: "flex" }}
              title={title}
            >
              {!props.hideFilterIcon && (
                <i
                  className={`${
                    this.props.icon ? this.props.icon : "bx bx-filter"
                  }`}
                />
              )}

              <span style={{ marginLeft: 5, marginRight: 5 }}>
                {props.text}
              </span>
              {props.selected_item && title && (
                <div
                  className="search-dropdown-text-selected"
                  style={{ marginRight: 5 }}
                >
                  <b>: {title}</b>
                </div>
              )}
            </div>
          </button>
          <div
            class="dropdown-menu"
            role="menu"
            aria-labelledby="dropdownMenuClickableInside"
          >
            <DropdownContent
              {...props}
              onReset={this.onReset.bind(this)}
              onSelectDropdownItem={(item) => this.onSelectDropdownItem(item)}
            />
          </div>
        </div>
      </>
    );
  }
}

export default DropdownButton;
