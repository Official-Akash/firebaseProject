var express = require('express'); //including express
var app = express(); //initialize express
var port = process.env.PORT || process.env.VCAP_APP_PORT || 3000; //post for localhost
app.use(express.static('./public')); // path to hosted directory

//########################for mail#################################
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
     "117676092431-be2trab7npjtiafnubcvg4uvpg8ejued.apps.googleusercontent.com", // ClientID
     "RMViuVic3SDRUX7WeFbzmMHL", // Client Secret
     "https://developers.google.com/oauthplayground" // Redirect URL
);
oauth2Client.setCredentials({
     refresh_token: "1/wsKPTeQHlE9xIyfRZ0ewUinq84cO2vN_sxdjm48iQ2k"
});
     
const accessToken = oauth2Client.refreshAccessToken()
     .then(res => res.credentials.access_token);

const smtpTransport = nodemailer.createTransport({
     service: "gmail",
     auth: {
          type: "OAuth2",
          user: "dummymailakash@gmail.com", 
          clientId: "117676092431-be2trab7npjtiafnubcvg4uvpg8ejued.apps.googleusercontent.com",
          clientSecret: "RMViuVic3SDRUX7WeFbzmMHL",
          refreshToken: "1/wsKPTeQHlE9xIyfRZ0ewUinq84cO2vN_sxdjm48iQ2k",
          accessToken: accessToken
     }
});
//#################################################################

var firebase = require("firebase-admin"); // including firebase
var serviceAccount = require("./serviceAccountKey.json"); //firebase service account File
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://fir-new-737dd.firebaseio.com"
});

//following function will get data when submit button is clicked with data
app.post('/gonow', (req, res) => {
	var POST = {};
	if (req.method == 'POST') {
        req.on('data', function(data) {
            data = data.toString();
            data = data.split('&');
            for (var i = 0; i < data.length; i++) {
                var _data = data[i].split("=");
                POST[_data[0]] = _data[1];
            }
			var db = firebase.database(); //firebase db init
			var usersRef = db.ref('/users'); //path to users node
			var userInformationRef = db.ref('/userInformation'); //path to userInformation node
			var usersCount = 1;
			var userInformationCount = 1;

			//checking how many childs are already there in users node
			usersRef.orderByValue().on("value", function(snapshot) {
				snapshot.forEach(function(data) {
					usersCount++;
				});
			});

			//resetting users node and userInformation node path to next value
			//this will prevent to overwrite values
			//i.e. if no value is previously inserted it will create child as 1
			//otherwise adding +1 to previous child node value
			//and inserting username and useremail to users node first
			//then if value is inserted then it will do same process for userInformation node
			usersRef = db.ref('/users/'+usersCount);
			userInformationRef = db.ref('/userInformation/'+usersCount);

			usersRef.set({
				user_name: unescape(POST.kname).replace("+"," "),
				user_email: unescape(POST.maile)
			}, function(error) {
				if (error) {
					alert("Data could not be saved." + error);
				} else {
					userInformationRef.set({
						user_name: unescape(POST.kname).replace("+"," "),
						user_email: unescape(POST.maile)
					}, function(error2){
						if(error2){
							alert("Data could not be saved." + error2);
						}else{
							const mailOptions = {
								 from: "dummymailakash@gmail.com",
								 to: unescape(POST.maile),
								 subject: "Welcome User",
								 generateTextFromHTML: true,
								 html: "<em>Dear "+unescape(POST.kname).replace("+"," ")+", Welcome to our app<em>"
							};
							smtpTransport.sendMail(mailOptions, (error, response) => {
								 error ? res.send(error) : res.send("Welcome "+unescape(POST.kname).replace("+"," "));
								 smtpTransport.close();
							});
						}
					});
				}
			});
			//res.send(unescape(POST.kname)+" "+unescape(POST.maile));
        })
    }
});

//starting server on port (defined at top of the page)
app.listen(port, function() {
  console.log('Server running on port: %d', port);
});
