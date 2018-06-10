const Express = require('express');
const Document = require('./document.js');

var Router = Express.Router();

Router.get('/', (request, response) => {
	response.json({});
});

Router.post('/', (request, response) => {
	// params
	var data = request.body;
	var key = Object.keys(data)[0],
		value = request.body[key];

	// prepare the object
	var now = Date.now();

	var object = {
		key: key,
		value: value,
		timestamp: now,
		utc: now // for debug, duman readable date
	};
	//console.log(object);

	// create document
	var doc = new Document(object);

	// save document
	doc.save();

	// send response
	response.json(object);
});

Router.get('/:key', (request, response) => {
	// params
	var key = request.params.key;
	var timestamp = request.query.timestamp;
	//console.log(request.params);
	//console.log(request.query);

	// prepare query for object with key
	var docQuery = Document.where({key: key});

	// set a sort so we get the latest
	docQuery.sort({timestamp: 'desc'});

	// set a query on timestamp if one is provided
	if (timestamp !== undefined) {
		docQuery.where('timestamp').lte(timestamp);
	}

	docQuery.findOne((err, doc) => {
		if (err) {
			//console.log(err);
			response.status(500);
			response.send(err);
			return;
		}

		//console.log(doc);

		if (doc) {
			var object = {
				//key: doc.key,
				value: doc.value,
				//timestamp: doc.timestamp,
				//utc: doc.utc // for debug, human readable date
			};

			response.json(object);

		} else {			
			response.status(404);
			response.json("Document Not Found");
		}
	});	
});

module.exports = Router;
