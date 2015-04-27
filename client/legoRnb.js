
var selected = [];

function beginBrush(margin, width, height, xGetter, yGetter, x, y){
var svg = d3.selectAll("svg");	
var brush = d3.svg.brush()
	.x(d3.scale.identity().domain([margin.left, width+ margin.left]))
        .y(d3.scale.identity().domain([margin.bottom, height+margin.bottom]));
	
var brushCell;
var node = svg.selectAll("circle");


var brusher = svg.append("g")
    	  	.attr("class", "brush")
     		.call(brush
        	.on("brushstart", brushstart)
        	.on("brush", 
		   function() {
          	     var e = brush.extent();
          	     node.classed("hidden", 
	               function(d) {
			       var p = d3.select(this);
			 var xx = p.attr("cx");
		         var yy = p.attr("cy");
		         if ( e[0][0]-margin.left > x(xGetter(d))  || x(xGetter(d)) > e[1][0]-margin.left
          			|| e[0][1]-margin.top >y(yGetter(d)) || y(yGetter(d)) > e[1][1]-margin.top){
			       	//d3.selectAll("#"+ d3.select(this).attr("id")).attr("fill", '#559');
			
					return true;
				}
		 	else{ 	 
				//selected.push(d3.select(this).attr("class"));
				var point = document.getElementById("set"+ d.set_id);
			     point.setAttribute("fill", "red");
				//console.log(p.size());
				return false;
			}
		       });

		   })
		.on("brushend", brushend));
    
    	function brushstart(){
      	  if(brushCell !== this){
          d3.select(brushCell).call(brush.clear());
          brushCell = this;}}

    	function brushend() {
      	  if (brush.empty()==true){ svg.selectAll(".hidden").classed("hidden", false);
		//original();
		clicked = false;}}

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



	beginBrush(margin, width, height, xGetter, yGetter, x, y);


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
    .attr("id", function (d) { return "set"+d.set_id.replace(/\./g, "-"); } )
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
  

//Interactions


    var svg = d3.selectAll("svg");
    var id = 0;
    var node = svg.selectAll("circle");
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
			   colorCount.push(0);
		   
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
           var numSetPieces = d3.max([sets[i].pieces, pieceCount]);

	   var maxColor = d3.max(colorCount);    //d3.max(b);
	   var colorPct = (100 * maxColor)/ numSetPieces;
	   var maxType = d3.max(d);
	   var typePct = (100 * maxType)/setPieces.length;
	   var maxCat = d3.max(f);
	   var catPct = (100 * maxCat)/setPieces.length;
	   
	   a=a.filter( function(value){ if (b[a.indexOf(value)]==maxColor) 
		   	return true; 
		   else return false; }); 
	   c=c.filter( function(value){ if (d[c.indexOf(value)]==maxType) 
		   	return true; 
	   	   else return false; }); 
	   e=e.filter( function(value){ if (f[e.indexOf(value)]==maxCat) 
		   	return true; 
		   else return false; }); 

           data[index] = {
		 set_id : sets[i].set_id.replace(/\./g,"-"),
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

