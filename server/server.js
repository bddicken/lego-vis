// server.js
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

var getMapOnKey = function(data, keyKey, valKey) {
    map = {};
    for (var i in data) {
        var datum = data[i];
        if ( !(datum[keyKey] in map) ) {
            map[datum[keyKey]] = [];
        }
        map[datum[keyKey]].push(datum[valKey]);
    }
    return map;
}
                

// All routes here

router.route('/setPieces/num/')
.get(function(req, res) {
    var sQ = Set.find().limit(maxReturn);
    var pQ = Piece.find().limit(maxReturn)
    var spQ = SetPiece.find().limit(maxReturn)

    sQ.exec(function(err, ss) {
        if (err) { res.send(err); }
        spQ.exec(function(err, sps) {
            if (err) { res.send(err); }
            pQ.exec(function(err, ps) {
                if (err) { res.send(err); }
            
                s_map = getMapOnKey(ss, 'id', 'descr');
                sp_map = getMapOnKey(sps, 'set_id', 'piece_id');
                p_map = getMapOnKey(ps, 'id', 'descr');

                var descs = {};
                var descs_tokens = {};
                var all_tokens = {};

                // populate "descs" with map of set_id -> description string
                for (var i in ss) {
                    var sid = ss[i].id;
                    if(sid in sp_map) {
                        var pida = sp_map[sid];
                        for (var j in pida) {
                            var pid = pida[j];
                            //console.log( "  b = " + pid);
                            //console.log( "  c = " + p_map[pid]);
                            if(pid in p_map) {
                                //console.log("p_map[pid] = " + p_map[pid]);
                                if( !(sid in descs) ) { descs[sid] = ''; }
                                descs[sid] += ' ' + p_map[pid];
                            }
                        }
                    }
                    descs[sid] += ' ' + ss[i].t1;
                }
                
                // populate "descs_tokens" with map of set_id -> description tokens
                for (var i in descs) {
                    
                    var tokens = descs[i].split(/([_\W])/);
                    var unique_tokens = tokens.filter(function(elem, pos) {
                        return tokens.indexOf(elem) == pos;
                    });
                    descs_tokens[i] = unique_tokens;

                    // update token counts
                    for (var i in unique_tokens) {
                        var t = unique_tokens[i];
                        if (!(t in all_tokens)) { all_tokens[t] = 0; }
                        all_tokens[t]++;
                    }
                }

                // Remove elements below threshold
                for (var i in all_tokens) {
                    if (all_tokens[i] < 50)
                        delete all_tokens[i];
                }
        
                var result = {};
                result['words'] = [];
                result['vecs'] = [];
                var keys = Object.keys(all_tokens);

                var counter = 0;
                for (var i in descs_tokens) {
                    
                    var t = descs_tokens[i]; 
                    var tm = {};
                    for (var j in t) { tm[t[j]] = 0; };
                    
                    var vector = [];

                    for (var k in keys) {
                        if (keys[k] in tm) { vector.push(99); }
                        else { vector.push(10); }
                    }
                    
                    result['words'].push(s_map[i] + "_" + counter);
                    result['vecs'].push(vector);

                    if (counter++ > 2000) break;
                }
                
                //console.log("t = " + result)
                res.json(result);
            });
        });
    });
});


router.route('/pieces/num/')
.get(function(req, res) {
    var pieceQ = Set.find().limit(maxReturn)
    pieceQ.exec(function(err, pieces) {
        if (err) { res.send(err); }

        var map = {};

        for (var i in pieces) {
            var p = pieces[i];
            if (pieces[i] == null) { console.log("err"); continue; }
            var t = p.descr.split(/([_\W])/);
            for (var j in t) {
                 var key = t[j].toLowerCase();
                if(map[key] == null)
                    map[key] = 1;
                else
                    map[key]++;
            }
        }

        for (var i in map) {
            //if (map[i] < 5 || map[i] > 10)
            if (map[i] < 50)
                delete map[i];
        }

        var result = {};
        var keys = Object.keys(map);
        //console.log("keys  = " + keys);

        result['words'] = [];
        result['vecs'] = [];

        //console.log("res = " + JSON.stringify(result));

        var counter = 0;
        for (var i in pieces) {
            
            var p = pieces[i];
            var t = p.descr.split(/([_\W])/);
            
            var tm = {};
            for (var j in t) { tm[t[j]] = 0; } // initialize tm
            console.log("tm  = " + JSON.stringify(tm));
            
            var vector = [];

            for (var k in keys) {
                if (keys[k] in tm) { vector.push(9); }
                else { vector.push(1); }

            }
            
            result['words'].push(p.descr + "_" + counter);
            result['vecs'].push(vector);

            if (counter++ > 500) break;
        }

        res.json(result);
    });
});

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

