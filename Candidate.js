var mongoose = require('mongoose');
Schema = mongoose.Schema;

var Candidate = new Schema({
    FirstName: String,
    LastName: String,
    Created: Date
});

module.exports = mongoose.model('Candidate', Candidate);