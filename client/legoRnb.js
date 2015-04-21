function toHex(v) {
    var str = "00" + Math.floor(Math.max(0, Math.min(255, v))).toString(16);
    return str.substr(str.length-2);
}

function rgb(r, g, b){
    return "#" + toHex(r * 255) + toHex(g * 255) + toHex(b * 255);
}

function color(count) {
    var amount = (2500 - count) / 2500 * 255;
    var s = toHex(amount), s2 = toHex(amount / 2 + 127), s3 = toHex(amount / 2 + 127);
    return "#" + s + s2 + s3;
}


var legoData = initLegoData(" ")

var appendScatterplot = function (data, xGetter, yGetter, xLabel, yLabel) {


    var margin = {top: 20, right: 15, bottom: 60, left: 60}, 
        width = 500 - margin.left - margin.right, 
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .domain([d3.min(data, function(d) { return xGetter(d); }), 
                 d3.max(data, function(d) { return xGetter(d); })])
        .range([ 0, width ]);

    var y = d3.scale.linear()
        .domain([d3.min(data, function(d) { return yGetter(d); }), 
                 d3.max(data, function(d) { return yGetter(d); }) ])
        .range([height, 0 ]);

    var chart = d3.select('body')
        .append('svg:svg')
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom)
        .attr('class', 'chart')

    // add background to all svg elements so we can click on background    
    chart.append("rect")
	.attr("id", "background_click")
	.attr("x",0)
	.attr("y",0)
	.attr("width",width+ margin.right + margin.left)
	.attr("height",height+ margin.top + margin.bottom)
	.attr("fill", "#FFFFFF");


    var main = chart.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'main')   

    // draw the x axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .ticks(6);

    var xAxisNodes = main.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .attr('class', 'main axis date')
	.call(xAxis);

    xAxisNodes.selectAll('.axis line, .axis path')
        .style({'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'});

    // x axis label	
    chart.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width + margin.left)
        .attr("y", height + margin.bottom)
        .text(xLabel);


    // draw the y axis
    var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .ticks(6);

    var yAxisNodes = main.append('g')
    .attr('transform', 'translate(0,0)')
    .attr('class', 'main axis date')
    .call(yAxis);

    yAxisNodes.selectAll('.axis line, .axis path')
        .style({'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'});
    
    // y axis label
    chart.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", -margin.top)
	.attr("y", 4)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text(yLabel);

    var g = main.append("svg:g"); 

    g.selectAll("scatter-dots")
    .data(data)
    .enter().append("svg:circle")
    .attr("id", function (d) { return "set"+d.set_id; } )
    .attr("cx", function (d) { return x(xGetter(d)); } )
    .attr("cy", function (d) { return y(yGetter(d)); } )
    .attr("fill", '#559')
    .attr("opacity", 0.5)
    .attr("r", 3);
}

legoData.onDataLoad = function() {
    
    console.log("custom function!");
    
    //var data = legoData.setsArray();
    var data2 = createData();
    
    appendScatterplot( 
 	    data2,
            function(d) { return d.setInfo.year; },
            function(d) { return d.setInfo.pieces; },
	    "Year", 
	    "Number of Pieces in Set");
    
    appendScatterplot(  
	    data2,
            function(d) { return d.setInfo.year; },
            function(d) { return d.setInfo.t1.length; },
	    "Year",
	    "Length of Category Name");
    
    appendScatterplot(
            data2,
	    function(d) { return d.setInfo.year; },
            function(d) { return d.setInfo.descr.length; },
	    "Year",
	    "Length of Set Description");
    
    appendScatterplot(
	    data2,
            function(d) { return d.setInfo.descr.length; },
            function(d) { return d.setInfo.pieces; },
	    "Length of Set Description",
	    "Number of Pieces in Set");
    
    appendScatterplot(
	    data2,
            function(d,i) { return d.setInfo.year; },
            function(d,i) { return d.setPieceInfo.length; },
	    "Year", 
	    "Number of Unique Pieces in Set");
  
    appendScatterplot(
	    data2,
            function(d) { return d.setInfo.pieces; },
            function(d) { return d.setPieceInfo.length; },
	    "Number of Pieces in Set",
	    "Number of Unique Pieces in Set");

    appendScatterplot(
	    data2,
            function(d,i) { return d.setInfo.year; },
            function(d,i) { return d.mostPieceColor.colorPct; },
	    "Year", 
	    "Color Percentage");
  
    appendScatterplot(
	    data2,
            function(d) { return d.setInfo.pieces; },
            function(d) { return d.mostPieceColor.colorCount; },
	    "Number of Pieces in Set",
	    "Number of Most Color Pieces in Set");

    appendScatterplot(
	    data2,
            function(d,i) { return d.setInfo.year; },
            function(d,i) { return d.avgPieceCount; },
	    "Year", 
	    "Average Piece Count");
  
    appendScatterplot(
	    data2,
            function(d) { return d.setInfo.pieces; },
            function(d) { return d.avgPieceCount; },
	    "Number of Pieces in Set",
	    "Average Piece Count");

    appendScatterplot(
	    data2,
            function(d,i) { return d.setInfo.year; },
            function(d,i) { return d.mostPieceType.typePct; },
	    "Year", 
	    "Type Percentage");
  
    appendScatterplot(
	    data2,
            function(d) { return d.setInfo.pieces; },
            function(d) { return d.mostPieceType.typeCount; },
	    "Number of Pieces in Set",
	    "Number of Most Type Pieces in Set");

    appendScatterplot(
	    data2,
            function(d,i) { return d.mostPieceColor.colorPct; },
            function(d,i) { return d.mostPieceType.typePct; },
	    "Color Percentage", 
	    "Type Percentage");
  
    appendScatterplot(
	    data2,
            function(d) { return d.mostPieceColor.colorCount; },
            function(d) { return d.mostPieceType.typeCount; },
	    "Number of Most Color Pieces in Set",
	    "Number of Most Type Pieces in Set");

    appendScatterplot(
	    data2,
            function(d) { return d.mostPieceColor.colors.length; },
            function(d) { return d.mostPieceColor.colorCount; },
	    "Number of Most Colors in a Set",
	    "Number of Most Color Pieces in Set");

    appendScatterplot(
	    data2,
            function(d) { return d.setInfo.descr.length; },
            function(d) { return d.avgPieceDescr;},
	    "Length of Set Description",
	    "Average Piece Description Length");

    appendScatterplot(
	    data2,
            function(d) { return d.setInfo.year; },
            function(d) { return d.avgPieceDescr; },
	    "Year",
	    "Average Piece Description Length");

    appendScatterplot(
	    data2,
            function(d) { return d.setInfo.year; },
            function(d) { return d.setInfo.descr.length/d.avgPieceDescr;  },
	    "Year",
	    "Ratio of Set Description Length to Average Piece Description Length");

    appendScatterplot(
	    data2,
            function(d) { return d.setInfo.year; },
            function(d) { return d.mostPieceColor.colors.length;  },
	    "Year",
	    "Number of Most Colors in a Set");

    appendScatterplot(
	    data2,
            function(d) { return d.setInfo.year; },
            function(d) { return d.mostPieceCat.cats.length },
	    "Year",
	    "Number of Most Categories");

    appendScatterplot(
	    data2,
            function(d) { return d.setInfo.year; },
            function(d) { return (d.mostPieceColor.colors[1]+1 >0) ? 
		    Math.log2(d.mostPieceColor.colors[1]+1) : -1  },
	    "Year",
	    "First Most Color (log)");

    appendScatterplot(
	    data2, 
            function(d) {return (d.mostPieceColor.colors[1]+1 >0) ? 
		    Math.log2(d.mostPieceColor.colors[1]+1) : -1  },
            function(d) { return d.setInfo.pieces; },
	    "First Most Color (log)",
	    "Number of Pieces in Set");





 //data[index] = {
//		 setInfo: sets[i], 
//		 setPieceInfo: pieces
//
//		      pieceDescr : (legoData.pieces[setPieces[j].piece_id] == undefined) ? 
//			      '0' : legoData.pieces[setPieces[j].piece_id].descr,
//		      pieceCategory :  (legoData.pieces[setPieces[j].piece_id] == undefined) ? 
//			      '0' : legoData.pieces[setPieces[j].piece_id].category,
//		      pieceId : setPieces[j].piece_id,
//		      color : setPieces[j].color,
//		      type : setPieces[j].type,
//		      pieceCount : setPieces[j].num}
//
//		 avgPieceDescr: pieceDescr/ setPieces.length,
//		 avgPieceCount: pieceCount/setPieces.length, 
//		 mostPieceCat: {cats: e, catCount: maxCat, catPct: catPct},
//		 avgPieceCount: pieceCount/setPieces.length, 
//		 mostPieceType: {types: c, typeCount: maxType, typePct: typePct},
//		 mostPieceColor: {colors: a, colorCount: maxColor, colorPct: colorPct}




//Interactions


    var svg = d3.selectAll("svg");
    var node = svg.selectAll("circle");
    var id = 0;
    var path = node
    .data(data2)
    .enter().append("circle");
   
    // mousing over highlights a point
    node.on("click", function(d,i){
	 if( id != 0){
	     d3.select("table").remove();
	     d3.selectAll("#set"+id)  
	    	.moveToBack()
	    	.attr("fill", '#559')
    	    	.attr("opacity", 0.5)
     	    	.attr("r", 3);
	 }
	 id = d.set_id;
 	 d3.selectAll("#set"+id)
	    .moveToFront()
	    .attr("fill", 'red')
    	    .attr("opacity", 1)
     	    .attr("r", 6);
       var setTable = tabulate(d,i);		
    
      });

    // mousing out removes highlight
    d3.selectAll("#background_click").on("click", function(d,i){
	 // path.filter(function (thisData) { return d === thisData; })
	    if( id != 0){
	      d3.select("table").remove();
	      d3.selectAll("#set"+id)  
	    	.moveToBack()
	    	.attr("fill", '#559')
    	    	.attr("opacity", 0.5)
     	    	.attr("r", 3);}
    });

	
    
    
    d3.selection.prototype.moveToFront = function() {
	return this.each(function(){
	    this.parentNode.appendChild(this);
	  });
    };

	
    d3.selection.prototype.moveToBack = function() { 
	 return this.each(function() { 
		var firstChild = this.parentNode.firstChild; 
		if (firstChild) { 
		    this.parentNode.insertBefore(this, firstChild); 
		} 
	 }); 
     };


};

legoData.loadAllData();


function createData(){

    var data = [];
    var sets = legoData.setsArray();
    var index = 0;

 //pieceDescrAvg, pieceDescrMax, pieceDescrMin, mostPieceCat.	


    for (i=0; i< sets.length; i++){
	 
	 var  setPieces = legoData.setPieces[sets[i].set_id];
       	 var pieces = [];
         var pieceCount = 0;
         var pieceTypes = [];
	 var pieceColors = [];
	 var pieceCats = [];
	 var pieceDescr = 0;
	 var allPieceColor = [];
	 var colorCount=[];

	 if(setPieces != undefined){
	   for (j=0; j< setPieces.length; j++){	
     		   pieceCount  = pieceCount + parseInt(setPieces[j].num);
		   pieceTypes[j] = setPieces[j].type;
	           pieceColors[j] = (isNaN(setPieces[j].color) || setPieces[j].color>2000) 
			   ? -1 : setPieces[j].color;
		   if (isNaN(setPieces[j].color));
		   else{
			  if (allPieceColor.indexOf(setPieces[j].color) ==-1) {
			   allPieceColor.push(setPieces[j].color);
			   colorCount[allPieceColor.indexOf(setPieces[j].color)] = parseInt(setPieces[j].num);
		   
			  }
	   	   colorCount[allPieceColor.indexOf(setPieces[j].color)] += parseInt(setPieces[j].num);
		   }	   
	
		   pieces[j]={
		      pieceDescr : (legoData.pieces[setPieces[j].piece_id] == undefined) ? 
			      '0' : legoData.pieces[setPieces[j].piece_id].descr,
		      pieceCategory :  (legoData.pieces[setPieces[j].piece_id] == undefined) ? 
			      '0' : legoData.pieces[setPieces[j].piece_id].category,
		      pieceId : setPieces[j].piece_id,
		      color : setPieces[j].color,
		      type : setPieces[j].type,
		      pieceCount : setPieces[j].num}
		   
		   pieceDescr = pieceDescr + pieces[j].pieceDescr.length;
		   pieceCats[j] = pieces[j].pieceCategory;
	   }
	   
	   pieceTypes = arrayMode(pieceTypes);
	   pieceColors = arrayMode(pieceColors);
	   pieceCats = arrayMode(pieceCats);	

	   var a = allPieceColor, b = colorCount;//pieceColors[0], b = pieceColors[1];
	   var c = pieceTypes[0], d = pieceTypes[1];
	   var e = pieceCats[0], f = pieceCats[1];
	   
	   var maxColor = d3.max(colorCount);    //d3.max(b);
	   var colorPct = (100 * maxColor)/ sets[i].pieces;
	   var maxType = d3.max(d);
	   var typePct = (100 * maxType)/setPieces.length;
	   var maxCat = d3.max(f);
	   var catPct = (100 * maxCat)/setPieces.length;
	   
	   a.filter( function(value){ return b[a.indexOf(value)]=maxColor; }); 
	   c.filter( function(value){ return d[c.indexOf(value)]=maxType; }); 
	   e.filter( function(value){ return f[e.indexOf(value)]=maxCat; }); 

           data[index] = {
		 set_id : sets[i].set_id,
		 setInfo: sets[i], 
		 setPieceInfo: pieces, 
		 avgPieceDescr: pieceDescr/ setPieces.length,
		 avgPieceCount: pieceCount/setPieces.length, 
		 mostPieceCat: {cats: e, catCount: maxCat, catPct: catPct},
		 mostPieceType: {types: c, typeCount: maxType, typePct: typePct},
		 mostPieceColor: {colors: a, colorCount: maxColor, colorPct: colorPct}
	 };
	 index++;
	 }
    }
    return data;

}

//function to find all max elements of two linked arrays
function arrayMode(arr) {
    var a = [], b = [], prev;

    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }

    return [a, b];
}


    // The table generation function
    function tabulate(d,i) {
      var setData = [
	["Set ID: ",  d.set_id ],
	["Year Made: ", d.setInfo.year],      
	["Category: ", d.setInfo.t1],
	["Number of Pieces: ", d.setInfo.pieces],
	["Number of Unique Pieces: " , d.setPieceInfo.length],
	["Average Piece Description Length: ", d.avgPieceDescr.toFixed(2) ],
	["Average Piece Count: ", d.avgPieceCount.toFixed(2)],
	["Most Piece Categories: ",arrayString(d.mostPieceCat.cats)],
	["Most Piece Category Percentage: ", d.mostPieceCat.catPct.toFixed(2)+"%"],
        ["Most Piece Colors: ", arrayString(d.mostPieceColor.colors)],
	["Most Piece Color Percentage: ", d.mostPieceColor.colorCount + " pieces " + d.mostPieceColor.colorPct.toFixed(2)+"%"],
	["Most Piece Tyes: ", arrayString(d.mostPieceType.types)],
	["Most Piece Type Percentage: ", d.mostPieceType.typePct.toFixed(2)+"%"]
		];

      var table = d3.select("body").append("table")
   		.style("border", "2px black solid")
		.selectAll("tr")
        	.data(setData)
	        .enter()
 	       	.append("tr")
		.selectAll("td")
		.data(function(d){return d;})
		.enter()
		.append("td")
		.style("border", "1px black solid")
    		//.style("padding", "5px")
		.text(function(d){return d;
		});
    }

function arrayString(aray){
    var string = "";	   
    for (i=0; i< aray.length; i++){
	string = string + aray[i];
	(i == aray.length-1) ?
		string = string : string = string + ", ";
    }
    return string;
}

