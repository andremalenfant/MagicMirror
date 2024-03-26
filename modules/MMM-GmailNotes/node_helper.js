var NodeHelper = require("node_helper");
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/keep.readonly"];
//const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

module.exports = NodeHelper.create({
	start: function() {
		console.log("Starting node helper: " + this.name);
	},

	// Subclass socketNotificationReceived received.
	socketNotificationReceived: function(notification, payload) {
		if (notification === 'NOTES-CONFIG') {
			this.config = payload;
			setInterval(() => {
				fs.readFile('/home/pi/MagicMirror/modules/MMM-GmailNotes/credentials.json', (err, content) => {
				if (err) return console.log('Error loading client secret file:', err);
				// Authorize a client with credentials, then call the Gmail API.
				console.log("credential read: " + content);
				this.authorize(JSON.parse(content), this.getNotes);
			});
			}, this.config.updateInterval);
			console.log("received config");
			// Load client secrets from a local file.
		}
	},

	authorize: function(credentials, callback) {
	  const {client_secret, client_id, redirect_uris} = credentials.web;
	  const oAuth2Client = new google.auth.OAuth2(
	      client_id, client_secret, ''); //

	  console.log('authorizing');
	  // Check if we have previously stored a token.
	  var self = this;
	  fs.readFile(TOKEN_PATH, (err, token) => {
	    if (err) return self.getNewToken(oAuth2Client, callback);
	    oAuth2Client.setCredentials(JSON.parse(token));
	    console.log('authorized');
	    callback(oAuth2Client, self);
	  });
	},

	getNewToken: function(oAuth2Client, callback) {
	  const authUrl = oAuth2Client.generateAuthUrl({
	    access_type: 'offline',
	    scope: SCOPES,
	  });
	  console.log('Authorize this app by visiting this url:', authUrl);
	  const rl = readline.createInterface({
	    input: process.stdin,
	    output: process.stdout,
	  });
	  rl.question('Enter the code from that page here: ', (code) => {
	    rl.close();
	    oAuth2Client.getToken('4/1AX4XfWhnZ6PuFYFx9b9ajbP-feZQAel6g4BMYBQLD0Op6Fy_r7QL0SdwKz8', (err, token) => {
	      if (err) return console.error('Error retrieving access token', err);
	      oAuth2Client.setCredentials(token);
	      // Store the token to disk for later program executions
	      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
	        if (err) return console.error(err);
	        console.log('Token stored to', TOKEN_PATH);
	      });
	      callback(oAuth2Client);
	    });
	  });
	},

	getNotes: function(auth, module) {
	console.log('getting notes');
	  //const gmail = google.gmail({version: 'v1', auth});
	  console.log(google);
	  const keep = google.keep({auth});
	  keep.get({name:'notes/*'}, (err, res) => {
	  	console.log(err);
	  	console.log(res);
	  });
	  console.log(keep);
	  /*gmail.users.messages.list({
	  	userId: 'andre@lafuiteautourdumonde.com',
	  	q: 'Walle',
	  }, (err, res) => {
	  		console.log(res.data.messages[0].id);
	  		if (err) return console.log('The API returned an error: ' + err);
			gmail.users.messages.get({
	    		userId: 'andre@lafuiteautourdumonde.com',
	    		id: res.data.messages[0].id,
	  		}, (err, res2) => {
	    		if (err) return console.log('The API returned an error: ' + err);	
	    		var htmlBody = Buffer.from(res2.data.payload.body.data, 'base64').toString('utf-8');
	    		console.log(htmlBody);
	    		module.sendSocketNotification('NOTES', htmlBody);
	  		});
	  });*/
	},

	/*listLabels: function(auth, module) {
	console.log('listing labels');
	  const gmail = google.gmail({version: 'v1', auth});
	  gmail.users.messages.list({
	  	userId: 'andre@lafuiteautourdumonde.com',
	  	q: 'subject:(Walle) label:Notes ',
	  }, (err, res) => {
	  		console.log(res.data.messages[0].id);
	  		if (err) return console.log('The API returned an error: ' + err);
			gmail.users.messages.get({
	    		userId: 'andre@lafuiteautourdumonde.com',
	    		id: res.data.messages[0].id,
	  		}, (err, res2) => {
	    		if (err) return console.log('The API returned an error: ' + err);	
	    		var htmlBody = Buffer.from(res2.data.payload.body.data, 'base64').toString('utf-8');
	    		console.log(htmlBody);
	    		module.sendSocketNotification('NOTES', htmlBody);
	  		});
	  });
	  
	},*/

});
