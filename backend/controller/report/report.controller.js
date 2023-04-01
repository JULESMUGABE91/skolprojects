// ========================================
// Author: Didier Kibugenza
// Email: kibugenzad@gmail.com
// version: 1.0
// ========================================

const { getEmailReceivers } = require("../../utils/emailReceiver");
const { sendEmailWithAttachment } = require("../../services/email");
const { generateAnswerPDFReport } = require("../../services/pdf/answer");
const moment = require("moment");

const httpAnswerPDFReport = async (req, res) => {
  try {
    const file = await generateAnswerPDFReport(req.body);

    await handleAttachmentEmail({ ...req.body, file });

    res.status(200).json(file);
  } catch (error) {
    res.status(400).json(error.stack);
  }
};

const handleAttachmentEmail = async (params) => {
  if (params.channel && params.channel.includes("email")) {
    await sendEmailWithAttachment({
      to: await getEmailReceivers({ organization: params.organization }),
      subject: "New Survey " + moment().format("lll"),
      message: `Greetings! <br/><br/> Please find the attachment of new survey <br/><br/>Best Regards<br/>MySkol Team`,
      file: params.file,
    });
  }
};

module.exports = {
  httpAnswerPDFReport,
};
