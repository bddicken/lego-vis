//"Code Folding Settings in _vimrc
//"from VIM use e: $MYVIMRC

//set foldmethod=indent   "fold based on indent
//set foldnestmax=10      "deepest fold is 10 levels
//set nofoldenable        "dont fold by default
//set foldlevel=3         


//////////////////////// Some Global Vars///////////////////////////
// Svg Margins:
var margin = {top: 20, right: 15, bottom: 50, left: 50}, 
    width = 350 - margin.left - margin.right, 
    height = 350 - margin.top - margin.bottom;

var brushCell;
var selection = []; 	// array of points selected by search
var e; 			// extent of brush
var clicked_set_id = "";		// set_id of clicked point
var clicked_color = "";
var All_Data = [];
var svg = d3.selectAll("svg");	
//////////////////////////////////////////////////////////////////

//////////////////// Function when starting brush //////////////////
function brushstart() {
	if(brushCell !== this){
    		d3.selectAll(".brush").call(brush.clear());
    		brushCell = this;
    		d3.selectAll("circle")
      		.classed("hidden", function(d) { return false; });
    }
    
    // Reset all points to blue
    d3.selectAll("circle")
        .attr("fill", "#559")
	.attr("opacity", 0.2);
    selection = []; 
    highlightClickedPoint();
}

// Function when brush ends
function brushend() {
	if (brush.empty()==true) {
		d3.select("table").remove();
		d3.select("#set-logo").remove();
    		d3.selectAll(".hidden").classed("hidden", false);
    		d3.selectAll("circle")
			.attr("fill", "#559")
			.attr("r", 3)
			.attr("opacity", 0.2);
  		clicked_set_id = ""; clicked_color = "";
	} else {
        e = brush.extent();
        var e00 = e[0][0] - margin.left;
        var e10 = e[1][0] - margin.left;
        var e01 = e[0][1] - margin.top;
        var e11 = e[1][1] - margin.top;
                
        d3.select(this.parentNode)
            .selectAll("circle")
            .attr("fill", "#559")
	    .attr("opacity", 0.2); 
        
        d3.select(this.parentNode)
                .selectAll("circle")
                .classed("hidden", function(d) {
                var p = d3.select(this); // SLOW
                var x = p.attr("cx");
                var y = p.attr("cy");
                var notInBrushRange = e00 > x || x > e10 || e01 > y || y > e11;
                if (!notInBrushRange) {
                    d3.selectAll("#" + p.attr("id"))
                        .attr("fill", "red"); // SLOW
                } 
                return false;
            });
    }
    if(clicked_set_id != undefined || clicked_set_id != "") highlightClickedPoint();
}
 
// Function when brush moves
function brushed() {
    // Don't do anything
}

// Create a brush on all svg elements
var brush = d3.svg.brush()
	.x(d3.scale.identity().domain([margin.left, width+ margin.left]))
    	.y(d3.scale.identity().domain([margin.top, height+margin.top]))
    	.on("brushstart", brushstart)
    	.on("brush", brushed) 
    	.on("brushend", brushend);
//////////////////////////////////////////////////////////////////////////    

// Function to get minimum
var min = function(d, getter) {
    	var value = +getter(d[0]);
    	for (var i in d) {
        	if (+getter(d[i]) < value) { 
            	value = +getter(d[i]);
        	}
    	}
    	return value;
}

// Function to get maximum
var max = function(d, getter) {
    	var value = +getter(d[0]);
    	for (var i in d) {
        	if (+getter(d[i]) > value) { 
            	value = +getter(d[i]);
        	}
    	}
    	return value;
}

var legoData = initLegoData(" ")
var chartCounter = 1;


/////////////////////////// Function to create scatterplots ////////////////////////
var appendScatterplot = function (data, xGetter, yGetter, xLabel, yLabel) {

    	var xmin = min(data, xGetter);
    	var xmax = max(data, xGetter);
    	var ymin = min(data, yGetter);
    	var ymax = max(data, yGetter);
	console.log(ymax);
   	var x = d3.scale.linear()
        	.domain([xmin, xmax])
        	.range([ 0, width ]);

    	var y = d3.scale.linear()
        	.domain([ymin, ymax])
        	.range([height, 0 ]);
    
    	var container = d3.select('#scatterplots')
        	.append('span');
    	var containerP = container.append('span');

    	var chartId = 'c' + chartCounter++;
    	var chart = containerP.append('svg:svg')
        	.style("margin", "5px")
        	.attr('width', width + margin.right + margin.left)
        	.attr('height', height + margin.top + margin.bottom)
        	.attr('class', 'chart')
        	.attr('id', chartId)

    	
    	chart.append("rect")
		.attr("id", "background_click")
		.attr("x",0)
		.attr("y",0)
		.attr("width",width+ margin.right + margin.left)
		.attr("height",height+ margin.top + margin.bottom)
		.attr("fill", "#FFFFFF");
    
    	chart.append("g")
        	.attr("class", "brush")
        	.call(brush);

    	var main = chart.append('g')
    		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            	.attr('width', width)
            	.attr('height', height)
            	.attr('class', 'main')   

    	// draw the x axis
    	var xAxis = d3.svg.axis()
        	.scale(x)
        	.orient('bottom')
        	.ticks(5)
		.tickFormat(d3.format("d"));

    	var xAxisNodes = main.append('g')
        	.attr('transform', 'translate(0,' + height + ')')
        	.attr('class', 'main axis date')
		.call(xAxis);

    	xAxisNodes.selectAll('.axis line, .axis path')
        	.style({'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'});

    	// x axis label	
    	chart.append("text")
        	.attr("class", "x axis-label label")
        	.attr("text-anchor", "end")
        	.attr("x", width + margin.left)
        	.attr("y", height + margin.bottom)
        .text(xLabel);


    	// draw the y axis
    	var yAxis = d3.svg.axis()
    		.scale(y)
    		.orient('left')
    		.ticks(5)
		.tickFormat(d3.format("d"));

    	var yAxisNodes = main.append('g')
    		.attr('transform', 'translate(0,0)')
    		.attr('class', 'main axis date')
    		.call(yAxis);

    	yAxisNodes.selectAll('.axis line, .axis path')
        	.style({'stroke': 'Black', 'fill': 'none', 'stroke-width': '1px'});
    
    	// y axis label
    	chart.append("text")
        	.attr("class", "y axis-label label")
        	.attr("text-anchor", "end")
        	.attr("x", -margin.top)
		.attr("y", 4)
        	.attr("dy", ".75em")
        	.attr("transform", "rotate(-90)")
        	.text(yLabel);

    	var g = main.append("svg:g"); 

    	g.selectAll("scatter-dots")
    		.data(data)
    		.enter()
		.append("svg:circle")
    		.attr("id", function (d) { return "set"+d.set_id.replace(/\./g, "-"); })
    		.attr("cx", function (d) { return x(xGetter(d)); })
    		.attr("cy", function (d) { return y(yGetter(d)); } )
    		.attr("fill", '#559')
    		.attr("opacity", 0.2)
    		.attr("r", 3);
}
//////////////////////////////////////////////////////////////////////////////////

///////////////////////////// Loading Data ////////////////////////////////////////
legoData.onDataLoad = function() {
    
    console.log("custom function!");
    
    //var data = legoData.setsArray();
    var data2 = createData();
    All_Data = data2;

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
  
   	/////////////////////////// Interactions/////////////////////

    	// Some Global Vars
    	var svg = d3.selectAll("svg");
	//var selection =[];
	//var clicked_set_id = 0;
	var p = 0;
    	var node = svg.selectAll("circle");
    	var searchInfo = "";
    	var path = node
    		.data(data2)
    		.enter()
		.append("circle");
   
    	// clicking a point highlights it
    	node.on("click", function(d,i){
            updateClickedSet(d,i);
      	});

	//for (j =0; j<9; j++){
	d3.selectAll(".image").on("click", function(d,j){
	    var stringId=d3.select("#banner_image"+j).attr('src');
	    stringId = stringId.substring(19,stringId.length -4);
	    console.log(stringId);
	    for (i=0; i< data2.length; i++){
	   	if(data2[i].set_id ==stringId) var d = data2[i];}
	    console.log(d);
	    updateClickedSet(d,i);
		});
	

    	// mousing out removes highlight
    	d3.selectAll("#background_click").on("click", function(d,i){
	      d3.select("table").remove();
	      d3.select("#set-logo").remove();	      
	      d3.selectAll("circle")  
	    	.attr("fill", '#559')
    	    	.attr("opacity", 0.2)
     	    	.attr("r", 3);
    	});

    // Helper function to bring a point to the front of the svg
    d3.selection.prototype.moveToFront = function() {
	return this.each(function(){
	    this.parentNode.appendChild(this);
	  });
    };

    // Helper function to move a point to the back of the svg
    d3.selection.prototype.moveToBack = function() { 
	 return this.each(function() { 
		var firstChild = this.parentNode.firstChild; 
		if (firstChild) { 
		    this.parentNode.insertBefore(this, firstChild); 
		} 
	 }); 
     };

    setUpSearch(data2);



};
//////////////////////////////////////////////////////////////////////////////////////

// CAll Function to load the data
legoData.loadAllData();

///////////////////////// Function to create the data ////////////////////////////
function createData(){
    var data = [];
    var sets = legoData.setsArray();
    var index = 0;

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

////////////////////////// Table generation function //////////////////////
function tabulate(d,i) {
    var setData = [
        ["Set ID: ",  d.set_id.replace(/\./g,"-") ],
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

    d3.select("#info-table-wrapper").select("#set-logo").remove();
    d3.select("#info-table-wrapper").select("#info-table").remove();

    // Show the image for the set
    d3.select("#info-table-wrapper").append("img")
        .attr("id", "set-logo")
        .style("margin", "10px")
        .style("width", "150px")
        .style("display", "inline-block")
        .style("border", "2px black solid")
        .attr("src", "download/img/sets/" + d.set_id + ".jpg")
        .attr("alt", "Lego set image");

    var table = d3.select("#info-table-wrapper").append("table")
        .attr("id", "info-table")
        .style("display", "inline-block")
        .selectAll("tr")
        .data(setData)
        .enter()
        .append("tr")
        .selectAll("td")
        .data(function(d){return d;})
        .enter()
        .append("td")
        .style("border", "1px black solid")
        .text(function(d){return d;});      
}

//////////////////////// User Search ////////////////////////////////////
function setUpSearch(data2){
    	
    var prev = "";

	// Get User's search value 
	d3.select("#search").on("keyup", function() {
	 	searchInfo = this.value.toLowerCase(); 
	});
	
	// Search for sets by set_id
	d3.select("#search-setid").on("click", function(){
		if (searchInfo != ""){
     	  	selection =[];
	  	for (i=0; i< data2.length; i++){
		  if ( data2[i].set_id.toLowerCase().substring(0,searchInfo.length) 
			  == searchInfo) 
			selection.push(data2[i].set_id) 
	  	  }
	   	  findSets(selection);
		}
	});

	// Search for sets by piece_id
	d3.select("#search-pieceid").on("click", function(){
		var setPieces =legoData.setPiecesArray();
		if (searchInfo != ""){
    	  	selection =[];
	  	for (i=0; i< setPieces.length; i++){
		  if ( setPieces[i].piece_id.
			  substring(0,searchInfo.length) == searchInfo) 
			selection.push(setPieces[i].set_id); 
	  	  }
	  	  findSets(selection);
		}
	});

	// Search for sets by word in descr or category (t1)
	d3.select("#search-descr").on("click",function(){
		if (searchInfo != ""){
     	  	selection =[];
	  	for (i=0; i< data2.length; i++){
		  var string = searchInfo.toLowerCase();
	    	  if (data2[i].setInfo.t1.toLowerCase().indexOf(string) >-1
			|| data2[i].setInfo.descr.toLowerCase().indexOf(string) >-1) 
			selection.push(data2[i].set_id);
	  	  }
	  	  findSets(selection);
		}
	});

	// Helper function for searching sets and coloring points 
	function findSets(selection){
        
        d3.selectAll("circle")
            .attr("fill", "#559")
	    .attr("opacity", 0.2); 
        
	  	if (selection.length ==0) {
		  d3.select("#noResult").remove();
		  d3.select("#buttons")
		    .append("p")
		    .attr("id", "noResult")
		    .html("No Results Found");
		}
		else {
		  d3.select("#noResult").remove();
	  	  for (j=0; j< selection.length; j++){
	  	    d3.selectAll("#set"+selection[j])
		      .moveToFront()
		      .attr("fill", "#FFFF00")
		      .attr("opacity", 1)
		      .attr("r", 3);
		  }
		  if (selection.length == 1){
		  	for (i=0; i < data2.length; i++){
			  if (data2[i].set_id == selection[0]){
				  tabulate(data2[i], i);
			  	  return;}
		  	}
		  }
		  prev = selection;
	  	}
        highlightClickedPoint();
	}	
}

// Helper function to color points
function colorPoints(id, isSelected){
    if (isSelected) { 
        return '#FFFF00';
    } 
}

function arrayString(aray){
    var string = "";	   
    for (i=0; i< aray.length; i++) {
        string = string + aray[i];
        (i == aray.length-1) ? string = string : string = string + ", ";
    }
    return string;
}
    	
// Highlight clicked point
function updateClickedSet(d,i){
    if(clicked_set_id != d.set_id){
        d3.select("table").remove();
        d3.select("#set-logo").remove();
        removeHighlight(clicked_set_id);
        var setTable = tabulate(d,i);		    
    }
    clicked_set_id = d.set_id;
    clicked_color = d3.select("#set"+clicked_set_id).attr("fill");
    highlightClickedPoint();
};

function highlightClickedPoint() {
    d3.selectAll("#set"+clicked_set_id)
        .moveToFront()
        .attr("fill", 'Lime')
        .attr("opacity", 1)
        .attr("r", 6);
}

// Helper function to remove colors on points	
function removeHighlight(id){
    var isSelected = selection.indexOf(id) > -1;  
    d3.selectAll("#set"+id)
        .moveToBack()
        .attr("fill", function(){
            return clicked_color;//colorPoints(id, isSelected)
        })
        .attr("opacity", function(){
            return isSelected ? 1 : 0.2; 	
        })
        .attr("r", 3);
}





	var shuffleSets = [{set_id:"10213-1"}, {set_id:"10175-1"},{set_id:"10176-1"},{set_id:"10177-1"}, {set_id:"10178-1"}, 
{set_id:"10185-1"}, {set_id:"10187-1"}, {set_id:"10210-1"}, {set_id:"10214-1"}, {set_id:"10221-1"}, 
{set_id:"10227-1"}, {set_id:"79108-1"}, {set_id:"79116-1"}, {set_id:"8940-1"}];
	// a few set ids to use before the data loads and to use when missing an image


	var howOften = 5; //number often in seconds to rotate
	var current = 3; //start the counter at 0
	var image_start = 1; // start image to load
	var errorSet = shuffleSets; //set ids to use when file not found for an image
	var next = 1;// initially 1, then set to 100 to "randomly" pick set ids

	function rotater() {
		if (image_start == 0) {
			next = 100;
			shuffleSets = All_Data; // data should be loaded by now
		} 
		//console.log("rotater is working");
		
		d3.select("#banner_image" + current)
			.transition()
			.duration(1000)
			.each("end", function(){ 	
				var image = d3.select("#banner_image"+current)
				.attr('src', '/download/img/sets/'+shuffleSets[image_start].set_id+ '.jpg');
				$('img').error(function(){
					$(this).attr("src", "/download/img/sets/" 
						+errorSet[image_start % 14].set_id+".jpg");});
				image.transition()
				.duration(1000)
				.delay(200)
				.style("opacity", 1);
				// "randomly" choose next image to update, in this case 3
				// just needs to be relatively prime to the number of img
				// elements. Modulo 7 creates wrap around; 7 img elements
				current = (current + 3) % 7;
    				// next image index in array, modulo array length to wrap 
				// around. 100 chosen since relatively prime to 9779 set ids
				image_start = (image_start + next) % shuffleSets.length;
			}).style("opacity", 0);
    		setTimeout("rotater()",howOften*1000);
	}

window.onload=rotater;

