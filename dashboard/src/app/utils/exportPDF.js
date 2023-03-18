import jsPDF from "jspdf";
import "jspdf-autotable";
import deepFind from "./deepFind";

const returnedData = (data, key) => {
  let result = [];

  for (let i = 0; i < data.length; i++) {
    result.push(data[i][key]);
  }

  return result;
};

export default (
  title,
  headers,
  data,
  orientation = "portrait",
  size = "A4"
) => {
  const unit = "pt";
  //   const size = "A4"; // Use A1, A2, A3 or A4
  //   const orientation = "portrait"; // portrait or landscape

  const marginLeft = 40;
  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(15);

  let _headers = headers.map((elt) => elt.title !== "Action" && elt.title);
  let keys = headers.map((elt) => elt.key);

  const body = data.map((elt) =>
    keys.map((key) => (elt[key] ? elt[key] : deepFind(elt, key)))
  );

  let content = {
    startY: 50,
    head: [_headers],
    body,
    styles: { halign: "left" },
    headStyles: { fillColor: [11, 147, 71] },
    alternateRowStyles: { fillColor: [236, 247, 241] },
    tableLineColor: [11, 147, 71],
    tableLineWidth: 0.1,
  };

  doc.text(title, marginLeft, 40);
  doc.autoTable(content);
  doc.save(title.toLowerCase() + "" + new Date().getTime() + ".pdf");
};
