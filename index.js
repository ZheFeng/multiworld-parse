const express = require('express');
const { default: ParseServer, ParseGraphQLServer } = require('parse-server');
const ParseDashboard = require('parse-dashboard');

const appId = 'multiworld-app-id';
const masterKey = 'multiworld-master-id';
const port = 4040;

const parseServer = new ParseServer({
	appId,
	masterKey, // Keep this key secret!
	databaseURI: 'mongodb://localhost:27017/dev', // Connection string for your MongoDB database
	cloud: './cloud/main.js', // Path to your Cloud Code
	serverURL: `http://localhost:${port}/parse` // Don't forget to change to https if needed
});

const parseGraphQLServer = new ParseGraphQLServer(
  parseServer,
  {
    graphQLPath: '/graphql',
    playgroundPath: '/playground'
  }
);



const options = { allowInsecureHTTP: false };
const dashboard = new ParseDashboard({
		"apps": [
			{
				appId,
				masterKey,
				"serverURL": `http://localhost:${port}/parse`,
				"appName": "Multi World",
				"graphQLServerURL": `http://localhost:${port}/graphql`,
			}
		]
	}, options);


const app = express();

// make the Parse Server available at /parse
app.use('/parse', parseServer.app); // (Optional) Mounts the REST API
parseGraphQLServer.applyGraphQL(app); // Mounts the GraphQL API
parseGraphQLServer.applyPlayground(app); // (Optional) Mounts the GraphQL Playground - do NOT use in Production


// make the Parse Dashboard available at /dashboard
app.use('/dashboard', dashboard);

const httpServer = require('http').createServer(app);
httpServer.listen(port);


console.log(`REST API running on http://localhost:${port}/parse`);
console.log(`GraphQL API running on http://localhost:${port}/graphql`);
console.log(`GraphQL Playground running on http://localhost:${port}/playground`);
console.log(`Dashboard running on http://localhost:${port}/dashboard`);