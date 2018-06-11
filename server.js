//require('dotenv').config();

//# Includes
const Express    = require("express");
const BodyParser = require("body-parser");
const Mongoose   = require("mongoose");
const Bluebird   = require("bluebird");
//console.log(process.env);

//# Init Components
// express
const app = Express();
app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());

// mongoose
Mongoose.Promise = Bluebird;
var dbPromise = Mongoose.connect(process.env.MONGO_URL)
					.then(() => console.log('MongoDB Connection Success'))
					.catch((err) => console.error(err));


//# Init App
// setup routes
const routes  = require("./app/routes.js");
app.use('/object', routes);

// init server
dbPromise.then(() => {
	const listener = app.listen(process.env.PORT, () => {
		console.log('Listening on Port: ' + listener.address().PORT);
	});
});


//# Handlers
process.on('SIGTERM', function () {
	console.log('shutting down');
	Mongoose.connection.close();
});
