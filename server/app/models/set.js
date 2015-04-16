var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SetSchema   = new Schema({
    id: String,
    year: Number,
    pieces: Number,
    t1: String,
    descr: String,
});

module.exports = mongoose.model('Set', SetSchema);
