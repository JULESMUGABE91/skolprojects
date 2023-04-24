import React, { Component } from "react";
import Table from "../../Table/Table";
import { Button } from "../../Button";
import { downloadExcel, downloadPDF } from "../../../utils/download";
import { CSVLink } from "react-csv";

let copyData = [];

class ChartGenderGroupTableModal extends Component {
  state = {
    search_text: "",
    isLoading: false,
    data: [],
    csvData: [],
  };

  componentDidMount() {
    const { data } = this.props;
    this.setState({ data, csvData: data });
    copyData = data.slice(0);
  }

  handleSearch(e) {
    let array = [],
      search_text = e.target.value;

    this.setState({ search_text });

    for (let el of copyData) {
      if (
        JSON.stringify(el).toLowerCase().indexOf(search_text.toLowerCase()) !==
        -1
      ) {
        array.push(el);
      }
    }

    this.setState({ data: array });
  }

  returnHeader = () => {
    return [
      {
        title: "Age Group",
        key: "ageGroup",
      },
      {
        title: "Gender",
        key: "gender",
      },
      {
        title: "Count",
        key: "Count",
      },
    ];
  };
  render() {
    return (
      <div className="card">
        <div className="card-body">
          <Table
            data={this.state.data}
            isSearch
            search_text={this.state.search_text}
            handleSearch={this.handleSearch.bind(this)}
            isLoading={this.state.isLoading}
            headers={this.returnHeader()}
          />
        </div>
        <hr />
        <div className="card-footer" style={{ display: "flex" }}>
          <div style={{ flex: 1 }} />
          <div style={{ marginRight: 15 }}>
            <Button
              text="Export PDF"
              className="btn-bordered"
              onPress={() =>
                downloadPDF({
                  filename: this.props.title + " " + new Date().getTime,
                  headers: this.returnHeader(),
                  data: this.state.data,
                })
              }
            />
          </div>
          <Button
            text="Export CSV"
            className="btn-primary"
            onPress={() => downloadExcel(this, { data: this.state.data })}
          />
        </div>
        <CSVLink
          ref="csvDownload"
          filename={this.state.title + " " + new Date().getTime()}
          data={this.state.csvData}
        ></CSVLink>
      </div>
    );
  }
}

export default ChartGenderGroupTableModal;
