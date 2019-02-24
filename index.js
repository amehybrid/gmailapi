//Program: Gmail API
//Description: An API that sends email using gmail smtp server
//Author: Aaron Galvez Dizon
//Prerequisites:
// 1: npm install
// 2: login to your gmail and unlock captcha https://accounts.google.com/b/0/DisplayUnlockCaptcha
//    see /public/unlockcaptcha.png
// 3: Go to https://myaccount.google.com/security and turn on Less Secure Apps access
//    see /public/lesssecureapps.png
// 4: change emailUsername and emailPassword
// 5: optional: change port

// Other requisites:
// at your first try you will get an email warning from google since it is receiving requests from unknown device
// go to the link on that email and allow device
//    see googlenotice.png

// Test:
// see /public/test.png

const express = require('express');
const app = express();
const http = require("https");

const emailUsername = 'REPLACE_THIS@gmail.com'
const emailPassword = 'REPLACE_THIS'

//To prevent self certification error
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const nodemailer = require('nodemailer');
const smtpTransport = require("nodemailer-smtp-transport");
const bodyParser = require('body-parser');

const port = process.env.PORT || 3051;

// make public folder as file server folder
app.use(express.static(__dirname + '/public'));

// extend parse and urlencode limits
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// handle PATH /email method POST
app.post('/email', function (req, res) {
  const transporter = nodemailer.createTransport(smtpTransport({
      secure : true,
      host : "smtp.gmail.com",
      port: 465,
      auth : {
          user : emailUsername,
          pass : emailPassword
      }

  }));

  const mailOptions = req.body;
  console.log('----------Displaying post body msg field----------');
  console.log(mailOptions);
  console.log('----------End of display----------');

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
	console.log(error);
      res.end(JSON.stringify(error));
    } else {
	console.log(info.response)
      res.end(info.response);
    }
  });
});

app.listen(port, function() {
  console.log("http nodemailer server listening on port " + port);
});

