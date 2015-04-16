
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
			//.classed(svgStyle, true);

		svg.selectAll(type)
			.data(data)
	   		.enter()
			.append(type)
			.attr(attrValues)
	   		.style(styleValues);
	}




var apiURL="http://localhost:9090/api/";

var container = d3.select("body").append("div");


var sets, pieces, setPieces, allInfo, remaining = 2;
allInfo=[];
//var p =[];
//d3.json(apiURL + "sets/", function(error, data) {
//    sets = data;
    //console.log(JSON.stringify(sets[0]));
//    console.log("Sets completely loaded");
//     setPieces = [];
//    for (i = 0; i< 2; i++){
//	d3.json(apiURL + "setPieces/set/" + sets[i].id, function(error, data) {
//    		setPieces[i] = data;
    		//console.log("SetPieces completely loaded");
//		p[i] = [];	
		//remaining = remaining + setPieces[i].length;
//	for (j=0; j< setPieces[i].length; j++){
//		d3.json(apiURL + "pieces/" + setPieces[i][j].piece_id, function(error, data) {
  //  		p[i][j] = data;
		//if (i==10){console.log("PieceINFO: " + JSON.stringify(data));}
        	//if (--remaining == 0) doSomething();
//		});
//	}
  //      if (p[i][setPieces[i].length-1] != undefined){
//		console.log(sets[i]); console.log(p[i]); console.log(setPieces[i]);
//	allInfo.push({ setInfo : sets[i], piecesInfo : p[i], setPiecesInfo : setPieces[i]});
//console.log(JSON.stringify(allInfo[0]));	
//	if (--remaining == 0) doSomething();}
//	});
    
  //  }
//  });




d3.json(apiURL + "sets/", function(error, data) {
    sets = data;
    console.log("Sets completely loaded");
    if (--remaining == 0) doSomething();
  });

d3.json(apiURL + "pieces/", function(error, data) {
    pieces = data;
    console.log("Pieces completely loaded");
    if (--remaining == 0) doSomething();
  });


//d3.json(apiURL + "setPieces/", function(error, data) {
//    setPieces = data;
//    console.log("set_Pieces completely loaded");
//    if (--remaining == 0) doSomething();
//  });

//d3.json(apiURL + "setPieces/allInfo", function(error, data) {
//    allInfo = data;
//    console.log("allInfo completely loaded");
    //generateInfo();
   //console.log(info[1]); 
    //if (--remaining == 0) doSomething();
//});


function generateInfo(setObj){
	var info =[];
	d3.json(apiURL + "setPieces/set/" + setObj.id, function(error, data){
		//var unique = _.pluck(data, 'piece_id').sort();
		//var avgCount = d3.sum(_.pluck(data, 'num')/data.length;
		//descrSum = 0, descrMax, descrMin, mostCat, 
		//var mostType = _.plick(data, 'type').sort();
	        //var mostColor=_.pluck(data, 'color').sort();
		//console.log(unique); 
		var count = 0; var type =[]; var typeCount=[]
		console.log(JSON.stringify(data)); //console.log(mostType); console.log(mostColor);
		var color =[]; var colorCount=[];
		for (i = 0; i< data.length; i++) {
		count = count + data[i].num;
		index1 = color.indexOf(data[i].color);
		//console.log(color.indexOf(data[i].color));
		if (index1 == -1) {	
			color.push(data[i].color);
			colorCount[color.indexOf(data[i].color)]=1;}
		else{ colorCount[index]++};
	
		index = type.indexOf(data[i].type);
		//console.log(type.indexOf(data[i].type));
		if (index == -1) {	
			type.push(data[i].type);
			typeCount[type.indexOf(data[i].type)]=1;}
		else{ typeCount[index]++};
		}
		
		//console.log(type); console.log(typeCount);
	info = {setID : setObj.id, year : setObj.year, numPieces : setObj.pieces, setCategory : setObj.t1, setDescr : setObj.descr, uniquePieces: data.length , avgPieceCount : count/data.length};
		//, mostPieceType :{type: type(typeCount.indexOf(d3.max(typeCount))), count: d3.max(typeCount)}};  
	// , mostPieceColor : {color: color(colorCount.indexOf(d3.max(colorCount))), count: d3.max(colorCount) }};
console.log(info);
//	pieceDescrAvg : , pieceDescrMax : , pieceDescrMin : , mostPieceCat : , d	
	});
}

function doSomething() {

generateInfo(sets[57]);
	
//console.log(JSON.stringify(sets[57]));
//var d=0;var p=[];
//	for (i=0; i<setPieces.length; i++){
//			if (setPieces[i].set_id == sets[57].id){
//				var data;
//				d3.json(apiURL + "pieces/" + setPieces[i].piece_id, 
//						function(error, setpiece){
//						data = setpiece;
//				p[d] = {piece_id : data.id, pieceInfo: data 
//					//,count: setPieces[i].num, color: setPieces[i].color,
//					//type: setPieces[i].type
//					};
//				console.log(JSON.stringify(p[d]));		
//						});
//			       d++;	
//			}
//		}

//d3.json(apiURL + "sets/", function(error, data) {

//    var allSets = container.selectAll(".div")
//        .data(data)
//        .enter()
//        .append("span")
//        .style("margin", "5px")
//        .style("display", "inline-block")
//        .style("height", "42px")
//        .style("border-style", "solid")
//        .style("border-width", "1px");
    
//    allSets
//        .append("img")
//        .attr("class", "link")
//        .attr("src", function(d) { return "/download/img/sets/" + d.id + ".jpg"; })
//        .attr("width", "40px" )
//        .attr("height", "40px" );
    
//    allSets
//        .append("span")
//        .attr("class", "set")
//        .html(function(d) { return d.descr + " : " + d.t1 + " : " + d.year; });
    
//    allSets
//        .append("a")appe
//        .attr("class", "link")
//        .attr("href", function(d) { return "set.html#" + d.id; })
//        .html("set-page");


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


