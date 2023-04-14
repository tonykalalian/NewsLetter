const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const { url } = require("inspector");
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});
app.post("/", (req, res) => {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  let data = {
    members: [
      {
        email_address: req.body.email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us8.api.mailchimp.com/3.0/lists/fcbfd21383";

  const options = {
    method: "POST",
    auth: "tony:8003acf560fea18d934ca2f5aedc27d3-us8",
  };
  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});
app.post("/failure", (req, res) => {
  res.redirect("/");
});
app.listen(process.env.PORT || 3000, () => {
  console.log("server is running on port 3000");
});

//API KEY: 34f5b284ba126c00e9c1bfa1b0c031b5-us8
// List id :  fcbfd21383
