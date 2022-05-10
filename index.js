const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const ParseDashboard = require('parse-dashboard');

const appId = 'multiworld-app-id';
const masterKey = 'multiworld-master-id';
const port = 4040;

const api = new ParseServer({
    appId,
    masterKey, // Keep this key secret!
    databaseURI: 'mongodb://localhost:27017/dev', // Connection string for your MongoDB database
    cloud: './cloud/main.js', // Path to your Cloud Code
    fileKey: 'optionalFileKey',
    serverURL: `http://localhost:${port}/parse` // Don't forget to change to https if needed
  });

const options = { allowInsecureHTTP: false };

const dashboard = new ParseDashboard({
    "apps": [
      {
        appId,
        masterKey,
        "serverURL": `http://localhost:${port}/parse`,
        "appName": "Multi World"
      }
    ]
  }, options);


const app = express();

// make the Parse Server available at /parse
app.use('/parse', api);

// make the Parse Dashboard available at /dashboard
app.use('/dashboard', dashboard);

const httpServer = require('http').createServer(app);
httpServer.listen(port);
console.log(`parse-server running on http://localhost:${port}/dashboard`);