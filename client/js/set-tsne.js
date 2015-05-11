var tsnePlot = (function() {

var tsnePlotVar = {};

tsnePlotVar.appendVectorGraph = function(containerSelection, allData, dimension, totalWidth, totalHeight) {

    allDataKeys = Object.keys(allData);
    var data = allData['Star Wars'];

    console.log("appending graph!");

    var tx=0, ty=0;
    var ss=1;
    
    var margin = {top: 10, right: 10, bottom: 10, left: 10};
    var width = totalWidth 
    var height = totalHeight 
    
    var x = d3.scale.linear()
        .domain([0, width])
        .range([0, width]);
    var y = d3.scale.linear()
        .domain([0, height])
        .range([height, 0]);
    
    var brushCell;

    var brushstart = function(p) {
        if (brushCell !== this) {
            d3.select(brushCell).call(brush.clear());
            brushCell = this;
        }
    }
    
    var svg = containerSelection.append("svg") // svg is global
        .style("display", "inline")
        .attr("width", width)
        .attr("height", height);
    
    var containerGroup = svg
        .append("g")
        .attr("class", "cont");

    var brushmove = function(p) { }

    var brushend = function(p) {

        var e = brush.extent();
        var b00 = e[0][0]; 
        var b01 = e[0][1];
        var b10 = e[1][0];
        var b11 = e[1][1];
        
        d3.selectAll("circle").attr("fill", '#559');
        
        svg.selectAll("circle").classed("hidden", function(d, i) {
            var xp = ((data.output[i][0]*20*ss + tx) + 400);
            var yp = ((data.output[i][1]*20*ss + ty) + 400) * (-1) + height;
            var value = b00 > xp || xp > b10 || b01 > yp || yp > b11;
            if (!value) { 
                d3.selectAll("#set" + d.set_id.replace(/\./g, "-")).attr("fill", "red"); // SLOW
            }
            return false;
        });


        if (brush.empty()) svg.selectAll(".hidden").classed("hidden", false);
        //console.log("players = " + JSON.stringify(players));
    }

    var brush = d3.svg.brush()
        .x(x)
        .y(y)
        .on("brushstart", brushstart)
        .on("brush", brushmove)
        .on("brushend", brushend);

    var getCategories = function() {
        var cats = {};
        var index = 0;
        for (var i in data.input.words) {
            var set = data.input.words[i];
            if ( !(set.t1 in cats)) {
                cats[set.t1] = {t1:'', x:0, y:0, cx:0, cy:0};
            }
            var x = ((data.output[i][0]*20*ss + tx) + 400) + 6;
            var y = ((data.output[i][1]*20*ss + ty) + 400) + 6;
            cats[set.t1].t1 = set.t1; 
            cats[set.t1].x += x; 
            cats[set.t1].y += y; 
            cats[set.t1].cx++; 
            cats[set.t1].cy++; 
            index++;
        }
        var catsa = $.map(cats, function(v) { return v; });
        return catsa;
    }

    var displayGroups = function() {
      var catsa = getCategories();
      
      svg.selectAll(".set-t1").remove();
      
      svg.selectAll("set-t1")
        .data(catsa).enter().append("text")
        .attr("class", "set-t1 shadow")
        .attr("font-size", 22)
        .attr("text-anchor", "top")
        .style("fill", "OrangeRed")
        .style("font-weight", "bold")
        .style("opacity", 1.0)
        .text(function(d) { return d.t1; })
        .attr("x", function(d) { return d.x / d.cx; })
        .attr("y", function(d) { return d.y / d.cy; });
    }

    var updateEmbedding = function(show_text) {

      // TODO: cleanup circle/text pairing
      svg.selectAll("image")
          .data(data.input.words)
          .attr("width", "30px")
          .attr("height", "30px")
          .attr("xlink:href", function(d) { return "download/img/sets/" + d.set_id + ".jpg"; })
          .on("click", function(d) { 
            // TODO: THIS IS HACKY!!!
            d3.selectAll("#set" + d.set_id.replace(/\./g, "-"))
              .classed("YOLO", function(d, i) {
                if (i == 2)
                    tabulate(d, i); 
              });
          }) 
          .attr("x", function(d,i) { 
            return ((data.output[i][0]*20*ss + tx) + 400);
          })
          .attr("y", function(d,i) { 
            return ((data.output[i][1]*20*ss + ty) + 400);
          });

      if (show_text) {
          
          svg.selectAll(".set-descr").remove();
          
          // show set names
          svg.selectAll("text")
            .data(data.input.words)
            .enter()
            .append("text")
            .attr("class", "set-descr")
            .attr("text-anchor", "top")
            .attr("text-anchor", "top")
            .attr("font-size", 12)
            .style("opacity", 0.8)
            .text(function(d) { 
                if (d.descr.length > 10) {
                    return d.descr.substr(0, 20) + "...";
                }
                return d.descr; 
            })
            .attr("x", function(d,i) { 
                return ((data.output[i][0]*20*ss + tx) + 400) + 30;
            })
            .attr("y", function(d,i) { 
                return ((data.output[i][1]*20*ss + ty) + 400) + 15;
            });
          
            displayGroups();

      } else {
          svg.selectAll(".set-descr").remove();
          displayGroups();
      }
    }

    var zoomHandler = function() {
        tx = d3.event.translate[0];
        ty = d3.event.translate[1];
        ss = d3.event.scale;
        updateEmbedding(ss > 2.5);
    }

    var zoomListener = d3.behavior.zoom()
        .scaleExtent([0.02, 10])
        .center([0,0])
        .on("zoom", zoomHandler);
    
    //brushend(null);
    //
    //zoomListener(svg);
        
    // Toggles zooming and brushing mode
    var toggleZoomBrush = function() {
        if (zoomBrushMode) {
          tzl = d3.behavior.zoom()
              .scaleExtent([0.1, 10])
              .center([0,0])
              .on("zoom", undefined);
          tzl(svg);
          containerGroup
            .append("g")
            .attr("class", "brush")
            .call(brush);
        }
        else {
            containerGroup.select(".brush").remove();
            zoomListener(svg);
        }
        zoomBrushMode = !zoomBrushMode;
        return zoomBrushMode ? "brush mode" : "zoom mode"; 
    }

    var zoomBrushMode = true;
   
   // select tsne category
   var selectCategory = d3.select("#tsne-plot-category").on("change", change);
   var options = selectCategory.selectAll('option').data(allDataKeys);

   // Enter selection
   options.enter().append("option").text(function(d,i) { return d; });

   selectCategory
        .append('option')
        .text('category for t-sne plot')
        .attr('selected', '');

   function change() {
       var selectedIndex = selectCategory.property('selectedIndex');
       // get the selected category name
       var dName = options[0][selectedIndex].__data__;
       data = allData[dName];
       drawTsnePlot();
   }
        
    var drawTsnePlot = function() {
   
        containerGroup.remove();
        containerGroup = svg
            .append("g")
            .attr("class", "cont");
        
        brush = d3.svg.brush()
            .x(x)
            .y(y)
            .on("brushstart", brushstart)
            .on("brush", brushmove)
            .on("brushend", brushend);

        var g = containerGroup.selectAll(".b")
            .data(data.input.words)
            .enter().append("g")
            .attr("class", "u");

        g.append("image")
            .attr("href", function(d) { return "downloads/img/sets/" + d.set_id + ".jpg"; })
            .attr("width", "25px");
        /*
        g.append("circle")
            .attr("id", function(d) { return "set" + d.set_id; })
            .attr("fill", function(d) { return "SlateBlue" })
            .attr("r", "4px");
        g.append("text")
            .attr("class", "set-descr")
            .attr("text-anchor", "top")
            .attr("font-size", 11)
            .text(function(d) { 
                if (d.descr.length > 10) {
                    return d.descr.substr(0, 20) + "...";
                }
                return d.descr; 
            });
            */

        updateEmbedding();
    
        zoomListener = d3.behavior.zoom()
            .scaleExtent([0.1, 10])
            .center([0,0])
            .on("zoom", zoomHandler);
        
        brushend(null);
        
        zoomListener(svg);
    
        // Zoom/Brush toggle button
        var zoomBrushButton = svg.append("g");
        var zoomBrushText = zoomBrushButton.append("text")
            .attr("x", 10)
            .attr("y", 22)
            .attr("text-anchor", "top")
            .attr("font-size", 14)
            .style("cursor", "pointer")
            .on("click", function(d) { 
                d3.select(this).text(function() { return toggleZoomBrush(); } );
            })
            .text(function() { return zoomBrushMode ? "brush mode" : "zoom mode"; } );
        var bbox = zoomBrushText.node().getBBox();
        var padding = 4;
        
        zoomBrushButton.insert("rect","text")
            .attr("x", bbox.x - padding)
            .attr("y", bbox.y - padding)
            .attr("width", bbox.width + (padding*2))
            .attr("height", bbox.height + (padding*2))
            .style("fill", "#ccc");
    }

    drawTsnePlot();
}

return tsnePlotVar;

})();
