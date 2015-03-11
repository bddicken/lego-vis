// server.js
//
// TODO: disable delete requests for production
//

// BASE SETUP
// =============================================================================

var dbConnectString = 'mongodb://localhost/legodb';

var express    = require('express');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var app        = express();

var Set      = require('./app/models/set');
var Piece    = require('./app/models/piece');
var SetPiece = require('./app/models/setPiece');
var Color    = require('./app/models/color');


var maxReturn = 100000000;

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 9090;

mongoose.connect(dbConnectString); 

// ROUTES FOR OUR API
// =============================================================================

var router = express.Router();              

// middleware t use for all requests
router.use(function(req, res, next) {
    console.log('Handling generic request.');

    // Dangerous!
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    res.header("Content-Type", "text/cache-manifest")

    next(); 
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to the api!' });   
});

// All routes here

router.route('/pieces/:id')
.get(function(req, res) {
    var id = req.params.id;
    var pieceQ = Piece.find({"id":id}).limit(maxReturn)
    pieceQ.exec(function(err, pieces) {
        if (err) { res.send(err); }
        res.json(pieces);
    });
});

router.route('/setPieces/set/:set_id')
.get(function(req, res) {
    var set_id = req.params.set_id;
    var setPQ = SetPiece.find({"set_id":set_id}).limit(maxReturn)
    setPQ.exec(function(err, setPieces) {
        if (err) { res.send(err); }
        res.json(setPieces);
    });
});

router.route('/sets')
.get(function(req, res) {
    Set.find(function(err, sets) {
        if (err) { res.send(err); }
        res.json(sets);
    });
});

router.route('/sets/:id')
.get(function(req, res) {
    var id = req.params.id;
    var setQ = Set.find({"id":id}).limit(maxReturn)
    setQ.exec(function(err, sets) {
        if (err) { res.send(err); }
        res.json(sets);
    });
});

// REGISTER OUR ROUTES -- all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================

app.listen(port);
console.log('Server running on port ' + port);

