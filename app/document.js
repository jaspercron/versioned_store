const mongoose 	= require('mongoose');

var Document = new mongoose.Schema({
	key: String,
	value: String,
	timestamp: String,
	utc: Date
});

module.exports = mongoose.model('Document', Document);
