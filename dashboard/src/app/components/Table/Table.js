import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import deepFind from "../../utils/deepFind";
import { Button, DropdownButton } from "../Button";
import { Input } from "../Input";
import { Pagination } from "../Pagination";
import "./styles.css";
import { LoadingSpinner } from "../LoadingSpinner";
import { CSVLink } from "react-csv";
import pdf from "../../assets/pdf.png";

let copyData = [];
class Table extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: props.page ? props.page : 1,
      limit: props.limit,
      search_text: "",
      data: props.data,
    };
  }

  componentDidMount(props) {
    copyData = this.props.data;
  }

  componentDidUpdate(nextProps, nextState) {
    if (nextState.data !== this.props.data) {
      this.setState({
        data: this.props.data,
      });
    }
  }

  handleSearch(e) {
    let new_data = [],
      search_text = e.target.value;

    for (let i = 0; i < copyData.length; i++) {
      if (
        JSON.stringify(copyData[i])
          .toUpperCase()
          .indexOf(search_text.toUpperCase()) !== -1
      ) {
        new_data.push(copyData[i]);
      }
    }

    this.setState({
      data: new_data,
      search_text,
    });
  }

  render() {
    const {
      handlePagination,
      headers,
      totalPageCount,
      actions,
      rowPress,
      no_bordered,
      filters,
      showAdd,
      addButtonText,
      handleAddPressed,
      isLoading,
      page,
      placeholder,
      handleSort,
      sortOrder,
      sortColumn,
      tab,
      handleDownloadFilePdf,
    } = this.props;

    const { limit, data } = this.state;

    const currentData = data;
    const firstPage = 1;
    const lastPage = totalPageCount;

    const paginate = async (numPage) => {
      await handlePagination(numPage, tab);
    };

    const nextPage = async () => {
      if (page === lastPage) return;
      await handlePagination(page + 1, tab);
    };

    const prevPage = async () => {
      if (page === firstPage) return;
      await handlePagination(page - 1, tab);
    };

    return (
      <>
        <div
          style={{
            paddingLeft: 0,
            paddingRight: 0,
            display: "block",
            alignItems: "flex-start",
          }}
        >
          <div className="row">
            <div className="col-md-4">
              {this.props.isSearch && (
                <div>
                  <Input
                    placeholder={placeholder ? placeholder : "Search..."}
                    value={
                      this.props.search_text
                        ? this.props.search_text
                        : this.state.search_text
                    }
                    onChange={
                      this.props.handleSearch
                        ? tab
                          ? (e) => this.props.handleSearch(tab, e)
                          : this.props.handleSearch
                        : this.handleSearch.bind(this)
                    }
                    iconRight="bx bx-search"
                    inputContainerStyle={{ marginBottom: 0 }}
                    autoComplete="off"
                    type="search"
                  />
                </div>
              )}
            </div>
            <div className="col-md-8 mb-3">
              <div className="d-flex gap-2 flex-wrap justify-content-end">
                {filters &&
                  filters.map((filter, f) => {
                    if (filter.button_type === "dropdown") {
                      return (
                        <div key={f}>
                          <DropdownButton
                            className="btn-default bordered btn-sm dropdown-toggle dropdown-toggle-split"
                            text={filter.title}
                            selected={filter.selected}
                            isSearchable={filter.isSearchable}
                            options={filter.options}
                            onSelectDropdownItem={filter.onSelectDropdownItem}
                            search_text={filter.search_text}
                            onChangeSearch={filter.onChangeSearch}
                            selected_item={filter.selected_item}
                            isLoading={filter.isLoading}
                            isMulti={filter.isMulti}
                            default_key={filter.default_key}
                            handleReset={filter.handleReset}
                            clickBehaviorId="dropdownMenuClickableInside"
                            autoCloseType="outside"
                            icon={filter.icon}
                          >
                            {filter.options.map((option, o) => {
                              return (
                                <li key={o}>
                                  {option.isDownloadCsv ? (
                                    <CSVLink
                                      filename={option.filename + ".csv"}
                                      data={
                                        option && option.csvData
                                          ? option.csvData
                                          : []
                                      }
                                      asyncOnClick={true}
                                      // onClick={
                                      //   option.onPress ? option.onPress : null
                                      // }
                                      onClick={(event, done) => {
                                        option.onPress().then((res) => {
                                          console.log(res);
                                          done(false); // Don't Proceed
                                        });
                                      }}
                                      className="dropdown-item"
                                    >
                                      {option.name
                                        ? option.name
                                        : option.label
                                        ? option.label
                                        : ""}
                                    </CSVLink>
                                  ) : (
                                    <Link
                                      onClick={() => option.onPress(option)}
                                      className="dropdown-item"
                                      to="#"
                                    >
                                      {option.name
                                        ? option.name
                                        : option.label
                                        ? option.label
                                        : ""}
                                    </Link>
                                  )}
                                </li>
                              );
                            })}
                          </DropdownButton>
                        </div>
                      );
                    } else {
                      return (
                        <Button
                          selected={filter.selected}
                          className="btn-gray btn-sm"
                          text={filter.title}
                          onPress={filter.onPress}
                          icon={filter.icon ? filter.icon : "bx bx-filter"}
                        />
                      );
                    }
                  })}
                {showAdd && (
                  <Button
                    className="btn-primary btn-sm"
                    onPress={handleAddPressed}
                    text={addButtonText}
                    icon="bx bx-plus"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table
            className={`table table-hover table-condensed ${
              !no_bordered && "table-bordered"
            }`}
            style={this.props.style}
          >
            <thead style={this.props.style_header}>
              <tr>
                {headers &&
                  headers.map((item, i) => {
                    return (
                      <th key={i} title={item.title}>
                        {item.title}
                        {item.sort && (
                          <button
                            className="sort-btn"
                            onClick={() => handleSort(item.key, tab)}
                          >
                            {(sortOrder === -1 || sortOrder === "desc") &&
                            sortColumn === item.key ? (
                              <i className="bx bx-up-arrow-alt"></i>
                            ) : (
                              <i className="bx bx-down-arrow-alt"></i>
                            )}
                          </button>
                        )}
                      </th>
                    );
                  })}
              </tr>
            </thead>
            <tbody className={this.props.tableBodyClass}>
              {isLoading ? (
                <tr>
                  <td colSpan={headers.length}>
                    <LoadingSpinner />
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={13} align="center">
                    No data found
                  </td>
                </tr>
              ) : (
                currentData.map((item, i) => {
                  let hasActionBtn = false;

                  return (
                    <tr key={i}>
                      {headers &&
                        headers.map((header) => {
                          hasActionBtn = header.key === "action";
                          let find_text = deepFind(item, header.key)
                            ? deepFind(item, header.key)
                            : "-";
                          const text =
                            header.isMoment &&
                            item[header.key] &&
                            item[header.key] !== ""
                              ? moment(item[header.key]).format(
                                  header.formatTime
                                )
                              : find_text;

                          return (
                            <>
                              {header.type === "photo" && (
                                <td>
                                  <img src={item[header.key]} />
                                </td>
                              )}
                              {header.type === "download_pdf" && (
                                <td onClick={() => handleDownloadFilePdf(item)}>
                                  <img
                                    src={pdf}
                                    style={{ width: 30, height: 30 }}
                                  />
                                </td>
                              )}
                              {header.type === "level" && (
                                <td>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <div
                                      style={{ marginRight: 10, marginTop: -5 }}
                                    >
                                      {/* <Circular
                                        width={18}
                                        height={18}
                                        percentage={item[header.key]}
                                      /> */}
                                    </div>
                                    <span>{item[header.key]} %</span>
                                  </div>
                                </td>
                              )}
                              {header.type === "link" && (
                                <td>
                                  <Link
                                    className="text-primary"
                                    onClick={() =>
                                      header.onPress
                                        ? header.onPress(item)
                                        : null
                                    }
                                    to="#"
                                  >
                                    <u> {text}</u>
                                  </Link>
                                </td>
                              )}
                              {header.type === "sensor_status" && (
                                <td>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: "50%",
                                        backgroundColor:
                                          item[header.key] === "off"
                                            ? "#f05"
                                            : "#fca311",
                                        marginRight: 10,
                                      }}
                                    />
                                    <span>{item[header.key]}</span>
                                  </div>
                                </td>
                              )}
                              {!hasActionBtn &&
                                header.type !== "photo" &&
                                header.type !== "level" &&
                                header.type !== "sensor_status" &&
                                header.type !== "download_pdf" &&
                                header.type !== "link" && (
                                  <td
                                    className="data"
                                    onClick={() =>
                                      header.key !== "action"
                                        ? rowPress(item)
                                        : null
                                    }
                                    // title={text}
                                    style={{
                                      whiteSpace: "nowrap",
                                      textOverflow: "ellipsis",
                                      maxWidth: 200,
                                      overflow: "hidden",
                                    }}
                                  >
                                    <span>{text + ""}</span>
                                  </td>
                                )}
                            </>
                          );
                        })}
                      {hasActionBtn && (
                        <td>
                          <div className="dropdown">
                            <Button
                              className="btn-transparent btn-sm "
                              type="button"
                              id="dropdownMenuButton1"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                              icon="bx-dots-vertical-rounded"
                            />
                            <ul
                              className="dropdown-menu"
                              aria-labelledby="dropdownMenuButton1"
                            >
                              {actions &&
                                actions.map((action, a) => {
                                  return (
                                    <Link
                                      key={a}
                                      className="dropdown-item"
                                      to={action.route ? action.route : "#"}
                                      onClick={() => action.onPress(item, i)}
                                    >
                                      {action.name}
                                    </Link>
                                  );
                                })}
                            </ul>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {totalPageCount !== 0 && totalPageCount && (
          <Pagination
            totalPageCount={totalPageCount}
            limit={limit}
            paginate={paginate}
            length={currentData.length}
            nextPage={nextPage}
            prevPage={prevPage}
            firstPage={firstPage}
            lastPage={lastPage}
            page={page}
            tab={tab}
          />
        )}
      </>
    );
  }
}

export default Table;
