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
  const url = "https://us21.api.mailchimp.com/3.0/lists/480d62ab58";
//   api key:480d62ab58
//   to have a better experience go to mailchimp generate an api for yourself and replace mine

  const options = {
    method: "POST",
    auth: "tony:9b823d0d91cf4e41fb0d0475279551a4-us21", 
//     listid:9b823d0d91cf4e41fb0d0475279551a4-us21
//  for a better experience go to mailchimp an copy your listid
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
app.listen(process.env.PORT || 3100, () => {
  console.log("server is running on port 3100");
});
