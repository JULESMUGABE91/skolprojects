import exportPDF from "../../utils/exportPDF";
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
