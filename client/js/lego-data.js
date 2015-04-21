/* Depends on jQuery */

var initLegoData = (function(urlPath) {

    var legoData = {};
   
    /* Map of set_id -> set object */
    legoData.sets = {};
    
    /* Map of piece_id -> piece object */
    legoData.pieces = {};
    
    /* Map of set_id -> an array of setPiece objects */
    legoData.setPieces = {};
    
    /* Map of id -> color object */
    legoData.colors = {};
   
    /* Returns array of all sets */
    legoData.setsArray = function() {
        return $.map(legoData.sets, function(v){ return v; });
    };
    
    /* Returns array of all pieces */
    legoData.piecesArray = function() {
        return $.map(legoData.pieces, function(v){ return v; });
    };

    /* Returns array of all setPieces */
    legoData.setPiecesArray = function() {
        var allSP = [];
        for (var i in legoData.setPieces) {
            for (var j in legoData.setPieces[i]) {
                allSP.push(legoData.setPieces[i][j]);
            }
        }
        return allSP;
    }

    /* Returns array of all colors */
    legoData.colorsArray = function() {
        return $.map(legoData.colors, function(v){ return v; });
    };

    legoData.urlPrefix = urlPath;

    legoData.filesLeftToDownload = 4;

    legoData.checkIfDataIsLoaded = function() {
        if(--legoData.filesLeftToDownload <= 0) { legoData.onDataLoad(); }
    }

    legoData.loadAllData = function() {
        
        d3.csv(legoData.urlPrefix + "/download/data/colors.csv", function(data) {
            for (var i in data) {
                legoData.pieces[data[i].id] = data[i];
            }
            console.log("done loading " + Object.keys(legoData.colors).length + " colors.");
            legoData.checkIfDataIsLoaded();
        });
        
        d3.csv(legoData.urlPrefix + "/download/data/pieces.csv", function(data) {
            for (var i in data) {
                legoData.pieces[data[i].piece_id] = data[i];
            }
            console.log("done loading " + Object.keys(legoData.pieces).length + " pieces.");
            legoData.checkIfDataIsLoaded();
        });

        d3.csv(legoData.urlPrefix + "/download/data/sets.csv", function(data) {
            for (var i in data) {
                legoData.sets[data[i].set_id] = data[i];
            }
            console.log("done loading " + Object.keys(legoData.sets).length + " sets");
            legoData.checkIfDataIsLoaded();
        });
        
        d3.csv(legoData.urlPrefix + "/download/data/set_pieces.csv", function(data) {
            for (var i in data) {
                if( ! (data[i].set_id in legoData.setPieces) ) {
                    legoData.setPieces[data[i].set_id] = [];
                };
                legoData.setPieces[data[i].set_id].push(data[i]);
            }
            console.log("done loading " + data.length + " SetPieces");
            console.log("Created set_id->setPiece object map of size " + Object.keys(legoData.setPieces).length);
            
            /*var j =100;
            for (var i in legoData.setPieces) {
                console.log("ld = " + legoData.setPieces[i]);
                if (i == j) { break; }
            }*/
            
            legoData.checkIfDataIsLoaded();
        });
    }

    legoData.onDataLoad = function() { 
        console.log("default data load function not yet overriden!"); 
    }

    return legoData;
});

