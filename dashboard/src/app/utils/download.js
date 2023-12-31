import axios from "axios";
import { ENDPOINT } from "../constants/api";
import exportPDF from "./exportPDF";

export const saveDownload = async ({ file, user, identifier }) => {
  return await axios({
    url: `${ENDPOINT}/file/read/pdf?file=${file}`,
    method: "GET",
    responseType: "blob",
  }).then((response) => {
    // create file link in browser's memory
    const href = URL.createObjectURL(response.data);

    // create "a" HTML element with href to file & click
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", user + "" + identifier + ".pdf"); //or any other extension
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  });
};

export const downloadExcel = (that, { data }) => {
  that.setState({
    isLoading: true,
  });

  that.setState(
    {
      isLoading: false,
      csvData: data,
    },
    () => {
      that.refs.csvDownload?.link.click();
    }
  );
};

export const downloadPDF = ({ filename, headers, data, orientation }) => {
  exportPDF(filename, headers, data, orientation);
};
