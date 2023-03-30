const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const multipart = require("connect-multiparty");
const { errorHandler } = require("./middleware/errorMiddleware");
const api = require("./routes");
const { createInvite } = require("./model/invites/invites.model");
const { DOMAIN_NAME } = require("./constant/string");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(morgan("combined"));

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
    parameterLimit: 50000,
  })
);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  multipart({ uploadDir: "./assets", maxFieldsSize: 4 * 1024 * 1024 + "MB" })
);
app.use(express.static(__dirname + "/assets"));

app.use("/api/v1", api);

app.get("/api/invite", async (req, res) => {
  res.sendFile(path.join(__dirname + "/view/invite.html"));

  const { org = "", uid = "", ref } = req.query;
  const link = `${DOMAIN_NAME}?org=${org}&uid=${uid}`;

  await createInvite({ organization: org, author: uid, link, ref });
});

// Catching Errors
app.use(errorHandler);

// exporting the express app
module.exports = app;
