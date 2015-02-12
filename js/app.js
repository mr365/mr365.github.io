var myApp = angular.module('myApp', []);
   
myApp.directive('myChart', function(){
  function link(scope, el, attr){
	

      var margin = {top: 20, right: 80, bottom: 30, left: 70};
    var width = 960 - margin.left - margin.right;
    var height = 400- margin.top - margin.bottom;

		var parseDate = d3.time.format("%Y%m%d").parse;

		var x = d3.time.scale()
		    .range([0, width]);

		var y = d3.scale.linear()
		    .range([height, 0]);

		var color = d3.scale.category10();

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom")
		    .ticks(d3.time.days, 1)
    		.tickFormat(d3.time.format('%a %d'))
    		

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left");

		var line = d3.svg.line()
		    .interpolate("basis")
		    .x(function(d) { return x(d.date); })
		    .y(function(d) { return y(d.clicks); });

		var svg = d3.select(el[0]).append('svg')
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
			.append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// injecting the data 

		d3.tsv("data1.tsv", function(error, data) {
			  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

			  data.forEach(function(d) {
			    d.date = parseDate(d.date);
			  });

			  var branches = color.domain().map(function(name) {
			    return {
			      name: name,
			      values: data.map(function(d) {
			        return {date: d.date, clicks: +d[name]};
			      })
			    };
			  });

		  x.domain(d3.extent(data, function(d) { return d.date; }))


		  y.domain([
		    d3.min(branches, function(c) { return d3.min(c.values, function(v) { return v.clicks; }); }),
		    d3.max(branches, function(c) { return d3.max(c.values, function(v) { return v.clicks; }); })
		  ]);

		  svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis);

		  svg.append("g")
		      .attr("class", "y axis")
		      .call(yAxis)
		    .append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")
		      .text("Clicks(perday)"); 

		  var branch = svg.selectAll(".branch")
		      .data(branches)
		    .enter().append("g")
		      .attr("class", "branch");

		  branch.append("path")
		      .attr("class", "line")
		      .attr("d", function(d) { return line(d.values); })
		      .style("stroke", function(d) { return color(d.name); });

		  branch.append("text")
		      .datum(function(d) { return {name: d.name, value: d.values[d.values.length-1]}; })
		      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.clicks) + ")"; })
		      .attr("x", 3)
		      .attr("dy", ".35em")
		      .text(function(d) { return d.name; });

		});
     }
      return {
        link: link,
        restrict: 'E'
      };
    });


