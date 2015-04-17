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

function makeCharts(id, num, data, w, h, type, attrValues, styleValues){
    var svg = d3.select("#"+id)
	.append("svg")
	.attr("width", w+"px")
	.attr("height", h+"px")
	.attr("id", id+num);

    svg.selectAll(type)
	.data(data)
	.enter()
	.append(type)
	.attr(attrValues)
	.style(styleValues);
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
    .attr("cx", function (d) { return x(xGetter(d)); } )
    .attr("cy", function (d) { return y(yGetter(d)); } )
    .attr("fill", '#559')
    .attr("opacity", 0.5)
    .attr("r", 3);
}

legoData.onDataLoad = function() {
    
    console.log("custom function!");
    
    var data = legoData.setsArray();

    appendScatterplot( 
 	    data,
            function(d) { return d.year; },
            function(d) { return d.pieces; },
	    "Year", 
	    "Number of Pieces in Set");
    
    appendScatterplot(  
	    data,
            function(d) { return d.year; },
            function(d) { return d.t1.length; },
	    "Year",
	    "Length of Category Name");
    
    appendScatterplot(
            data,
	    function(d) { return d.year; },
            function(d) { return d.descr.length; },
	    "Year",
	    "Length of Set Description");
    
    appendScatterplot(
	    data,
            function(d) { return d.descr.length; },
            function(d) { return d.pieces; },
	    "Length of Set Description",
	    "Number of Pieces in Set");

    var data2 = createData();
    
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


 //data[index] = {
//		 setInfo: sets[i], 
//		 setPieceInfo: pieces, 
//		 avgPieceCount: pieceCount/setPieces.length, 
//		 mostPieceType: {types: c, typeCount: maxType, typePct: typePct},
//		 mostPieceColor: {colors: a, colorCount: maxColor, colorPct: colorPct}

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
	 //var pieceCats = [];
	 //var pieceDescr = [];

	 if(setPieces != undefined){
	   for (j=0; j< setPieces.length; j++){	
     		   pieceCount  = pieceCount + parseInt(setPieces[j].num);
		   pieceTypes[j] = setPieces[j].type;
		   pieceColors[j] = setPieces[j].color;

		   pieces[j]={
		      pieceDescr : (legoData.pieces[setPieces[j].piece_id] == undefined) ? 
			      '0' : legoData.pieces[setPieces[j].piece_id].descr,
		      pieceCategory :  (legoData.pieces[setPieces[j].piece_id] == undefined) ? 
			      '0' : legoData.pieces[setPieces[j].piece_id].category,
		      pieceId : setPieces[j].piece_id,
		      color : setPieces[j].color,
		      type : setPieces[j].type,
		      pieceCount : setPieces[j].num}
	   }
	   pieceTypes = arrayMode(pieceTypes);
	   pieceColors = arrayMode(pieceColors);
	   
	   var a = pieceColors[0], b = pieceColors[1];
	   var c = pieceTypes[0], d = pieceTypes[1];
	   
	   var maxColor = d3.max(b);
	   var colorPct = (100 * maxColor)/ setPieces.length;
	   var maxType = d3.max(d);
	   var typePct = (100 * maxType)/setPieces.length;
	   
	   a.filter( function(value){ return b[a.indexOf(value)]=maxColor; }); 
	   c.filter( function(value){ return b[a.indexOf(value)]=maxType; }); 
	

         data[index] = {
		 setInfo: sets[i], 
		 setPieceInfo: pieces, 
		 avgPieceCount: pieceCount/setPieces.length, 
		 mostPieceType: {types: c, typeCount: maxType, typePct: typePct},
		 mostPieceColor: {colors: a, colorCount: maxColor, colorPct: colorPct}
	 };
	 index++;
	 }
    }
    console.log(data[1]);    
    return data;

}


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















//var container = d3.select("body").append("div");

function doSomething() {
//	var info =[];
//	d3.json(apiURL + "setPieces/set/" + setObj.id, function(error, data){
		//var unique = _.pluck(data, 'piece_id').sort();
		//var avgCount = d3.sum(_.pluck(data, 'num')/data.length;
		//descrSum = 0, descrMax, descrMin, mostCat, 
		//var mostType = _.plick(data, 'type').sort();
	        //var mostColor=_.pluck(data, 'color').sort();
		//console.log(unique); 
//		var count = 0; var type =[]; var typeCount=[]
//		console.log(JSON.stringify(data)); //console.log(mostType); console.log(mostColor);
//		var color =[]; var colorCount=[];
//		for (i = 0; i< data.length; i++) {
//		count = count + data[i].num;
//		index1 = color.indexOf(data[i].color);
//		//console.log(color.indexOf(data[i].color));
//		if (index1 == -1) {	
//			color.push(data[i].color);
//			colorCount[color.indexOf(data[i].color)]=1;}
//		else{ colorCount[index]++};
//	
//		index = type.indexOf(data[i].type);
//		//console.log(type.indexOf(data[i].type));
//		if (index == -1) {	
//			type.push(data[i].type);
//			typeCount[type.indexOf(data[i].type)]=1;}
//		else{ typeCount[index]++};
//		}
//		
//		//console.log(type); console.log(typeCount);
//	info = {setID : setObj.id, year : setObj.year, numPieces : setObj.pieces, setCategory : setObj.t1, setDescr : setObj.descr, uniquePieces: data.length , avgPieceCount : count/data.length};
		//, mostPieceType :{type: type(typeCount.indexOf(d3.max(typeCount))), count: d3.max(typeCount)}};  
	// , mostPieceColor : {color: color(colorCount.indexOf(d3.max(colorCount))), count: d3.max(colorCount) }};
//console.log(info);
//	pieceDescrAvg : , pieceDescrMax : , pieceDescrMin : , mostPieceCat : , d	


var w = 450;
var h = 450;
var m = 50;
d3.selectAll("svg").attr("width",w).attr("height",h); 


var yearExtent = d3.extent(sets, function(row) { return row.year; });
var piecesExtent = d3.extent(sets, function(row) { return row.pieces; });

var xScaleYear = d3.scale.linear().domain(yearExtent).range([m, w-m]);
var yScalePieces = d3.scale.linear().domain(piecesExtent).range([h-m, m]);

var xAxisYear = d3.svg.axis().scale(xScaleYear);
var yAxisPieces = d3.svg.axis().scale(yScalePieces);



//var Extent = d3.extent(data, function(row) { return row.year; });
var descrExtent = d3.extent(sets, function(row) { return row.descr.length; });
var setPieceExtent = d3.extent(pieces, function(row){return row.descr.length;});
var idPieceExtent = d3.extent(pieces, function(row, i){ return i;});
//var pieceCountExtent = d3.extent(setPieces, function(row, i){return row.num;});
var pieceDescrExtent = d3.extent(pieces, function(row, i){return row.descr.length});

var xScalePieces = d3.scale.linear().domain(piecesExtent).range([m, w-m]);
var yScaleDescr = d3.scale.linear().domain(descrExtent).range([h-m, m]);
var xScaleDescr = d3.scale.linear().domain(descrExtent).range([m, w-m]);
var yScalesetPiece = d3.scale.linear().domain(setPieceExtent).range([h-m,m]);
var xScaleidPieces = d3.scale.linear().domain(idPieceExtent).range([m,w-m]);
//var yScalePieceCount = d3.scale.linear().domain(pieceCountExtent).range([h-m, m]);
var xScalePieceDescr = d3.scale.linear().domain(pieceDescrExtent).range([m,w-m]);

var xAxisPieces = d3.svg.axis().scale(xScaleYear);
var yAxisDescr = d3.svg.axis().scale(yScaleDescr);



var attrValues={
	cx: function(d){return xScaleYear(d.year);},
	cy: function(d){ return yScalePieces(d.pieces);},
	r: function(d){return 1;}};
var styleValues={	
	stroke: "blue",
	fill: "blue"};

var attrValues2={
	cx: function(d){return xScaleYear(d.year);},
	cy: function(d){ return yScaleDescr(d.descr.length);},
	r: function(d){return 1;}};

var attrValues3={
	cx: function(d){ return xScaleDescr(d.descr.length);},
	cy: function(d){return yScalePieces(d.pieces);},
	r: function(d){return 1;}};

var attrValues4={
	cx: function(d,i){ return xScaleidPieces(i);},
	cy: function(d){return yScalesetPiece(d.descr.length);},
	r: function(d){return 1;}};


var attrValues5={
	cx: function(d){
		return 1;},
	cy: function(d){ return 100;},// yScalePieceCount(d.num);},
	r: function(d){return 1;}};



//function(d){ d3.json(apiURL + "setPieces/set/" + d.id , function(error, data) {
    
//  });


//d3.select("body").select("p").data(data).enter().append("p").text(function(d){ return Object.keys(d);});

// year versus number of pieces
d3.select("body").append("div").attr("id", "chart1");

makeCharts("chart1","1",sets, w,h, "circle", attrValues, styleValues);

// year versus description length
d3.select("body").append("div").attr("id", "chart2");

makeCharts("chart2","2",sets, w,h, "circle", attrValues2, styleValues);

// description length versus number of pieces
d3.select("body").append("div").attr("id", "chart3");

makeCharts("chart3","3",sets, w,h, "circle", attrValues3, styleValues);

// 1-D index of piece versus pieces description length
d3.select("body").append("div").attr("id", "chart4");

makeCharts("chart4","4",pieces, w,h, "circle", attrValues4, styleValues);



d3.select("body").append("div").attr("id", "chart5");

makeCharts("chart5","5",sets, w,h, "circle", attrValues5, styleValues);

}


