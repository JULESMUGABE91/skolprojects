var PdfPrinter = require("pdfmake");
const path = require("path");
const { findAnswer } = require("../../model/answer/answer.model");
const { findSurveyById } = require("../../model/survey/survey.model");
const moment = require("moment");
var fonts = {
  Roboto: {
    normal: path.join(__dirname, "..", "pdf", "/fonts/Roboto-Regular.ttf"),
    bold: path.join(__dirname, "..", "pdf", "/fonts/Roboto-Medium.ttf"),
    italics: path.join(__dirname, "..", "pdf", "/fonts/Roboto-Italic.ttf"),
    bolditalics: path.join(
      __dirname,
      "..",
      "pdf",
      "/fonts/Roboto-MediumItalic.ttf"
    ),
  },
};

var printer = new PdfPrinter(fonts);
var fs = require("fs");
const { inputs } = require("../../constant/string");

const formatAnswer = (answers) => {
  let table_body = [["#", "Answer"]];

  for (let [i, answer] of answers.entries()) {
    if (answer.type === "dropdown" && answer.selection) {
      for (let [s, item] of answer?.selection?.entries() || []) {
        table_body.push([answer.option, item.value]);
      }
    } else {
      table_body.push([
        i + 1,
        inputs.includes(answer.type)
          ? answer?.value || ""
          : answer?.option || "",
      ]);
    }
  }

  return table_body;
};

const generateAnswerPDFReport = async (params) => {
  const { identifier, survey } = params;
  const answers = await findAnswerNormal({ ...params });
  const surveyInfo = await findSurveyById(survey);

  let started_location = "",
    end_location = "",
    started_date = "",
    end_date = "";

  let docDefinition = {
    content: [{ text: surveyInfo.title, style: "header" }],
    styles: {
      header: {
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 13,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      tableExample: {
        margin: [0, 5, 0, 15],
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: "black",
      },
      quote: {
        italics: true,
      },
      small: {
        fontSize: 8,
      },
    },
    defaultStyle: {
      // alignment: 'justify'
    },
  };

  for (let answer of answers) {
    let answer_table = formatAnswer(answer.answers);

    started_location = answer?.start_location?.address || "unknown";
    end_location = answer?.end_location?.address || "unknown";
    started_date = answer?.start_interview
      ? moment(answer?.start_interview).format("lll")
      : "-";
    end_date = answer?.end_interview
      ? moment(answer?.end_interview).format("lll")
      : "-";

    docDefinition.content.push(
      {
        text: answer.question.position + ". " + answer.question.question,
        style: "subheader",
      },
      "",
      {
        style: "tableExample",
        table: {
          widths: [100, 300],
          body: answer_table,
        },
      }
    );
  }

  docDefinition.content.push({
    text: "Date: " + started_date + "   -   " + end_date + "\n\n",
    style: ["quote", "small"],
  });

  docDefinition.content.push({
    text: "Location: " + started_location + "  -  " + end_location + "\n\n",
    style: ["quote", "small"],
  });

  var options = {};

  var pdfDoc = printer.createPdfKitDocument(docDefinition, options);

  let file_path = path.join(
    __dirname,
    "../../reports/pdf/New Survey" + identifier + ".pdf"
  );

  pdfDoc.pipe(fs.createWriteStream(file_path));
  pdfDoc.end();

  return file_path;
};

module.exports = {
  generateAnswerPDFReport,
};
