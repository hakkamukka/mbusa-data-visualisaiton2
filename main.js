var dataUrl = "https://raw.githubusercontent.com/IsaKiko/D3-visualising-data/gh-pages/code/nations.json";

d3.json(dataUrl, function(nations) {
    // // write a filter of the data returning only the countries in "America"
    // var america_countries = data.filter(function(nations) {
    //     return nation.region = 'America';
    // })
    // console.log(america_countries);

    // // write a map of the "American" nations returning most recent life expectancy
    // var america_countries_life = america_countries.map(function(nations) {
    //     return [nation.name, nation.lifeExpectancy[nation.lifeExpectancy.length - 1]]
    // })
    // console.log(america_countries_life);

    
    var chart_area = d3.select("#chart_area");
    var frame = chart_area.append("svg");
    var canvas = frame.append("g");

    // Set margins, width, and height.
    var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 39.5};
    var frame_width = 960;
    var frame_height = 350;
    var canvas_width = frame_width - margin.left - margin.right;
    var canvas_height = frame_height - margin.top - margin.bottom;

    frame.attr({
        "width": frame_width,
        "height": frame_height,
    });

    canvas.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var circle = frame.append("circle")
    circle.attr({
        "cy":50,
        "cx":50,
        "r":40,
        "fill":"green",
        "stroke":"black",
        "stroke-width":2
    })


    // create a log scale for the income
    // var xScale = d3.scale.log(); // income
    // xScale.domain([250, 1e5]); // set minimum and maximum value
    // xScale.range([0, canvas_width]); // set minimum and maximum range on the page
    var xScale = d3.scale.log().domain([300, 1e5]).range([0, canvas_width]);  
    var yScale = d3.scale.linear().domain([85, 10]).range([0,canvas_height]);  
    // scale for the radius of the dots using population
    var rScale = d3.scale.sqrt().domain([0, 5e8]).range([0, 40]);
    // create a colour scale using region
    var colourScale = d3.scale.category20();

    // Creating the x & y axes.
    var xAxis = d3.svg.axis().orient("bottom").scale(xScale);
    var yAxis = d3.svg.axis().orient("left").scale(yScale);

    // add the x-axis to the canvas
    // transform is used to shift the x axis to the bottom of the canvas
    canvas.append("g").attr("class", "x axis")
        .attr("transform", "translate(0," + canvas_height + ")")
        .call(xAxis);

    canvas.append("g").attr("class", "y axis")
        .call(yAxis);

    // inserting data...
    var filtered_nations = nations.map(function(nation) {
        return nation;
    })

    var data_canvas = canvas.append("g")
        .attr("class", "data_canvas");

    var year_idx = parseInt(document.getElementById("year_slider").value) - 1950;

    function updatePlot() {
        // dot is an empty set, telling it where to find the data
        // this is binding the data to the set
        var dot = data_canvas.selectAll(".dot")
            .data(filtered_nations, function(d) {return d.name});

        // insert dots into the set
        dot.enter().append("circle").attr("class","dot")
            .style("fill", function(d) { return colourScale(d.region)})
            
            ;

        dot.exit().remove();

        dot.transition().ease("linear").duration(5000)
            .attr("cx", function(d) { return xScale(d.income[year_idx]); }) 
            .attr("cy", function(d) { return yScale(d.lifeExpectancy[year_idx]); })
            .attr("r", function(d) { return rScale(d.population[year_idx])});
    }
    updatePlot();

    // evoke function on check box
    d3.selectAll(".region_cb").on("change", function() {
        var region = this.value;

        if (this.checked) {
            var new_nations = nations.filter(function(nations) {
                return nations.region == region;
            })
            for (var i = new_nations.length - 1; i >= 0; i--) {
                filtered_nations.push(new_nations[i]);
            }

            // var new_nations = nations.filter(function(nations) {
            //     return nations.region == region;
            // })

            // filtered_nations = filtered_nations.concat(new_nations);
        } else {
            // removing a region
            filtered_nations = filtered_nations.filter(function(nation) {
                return nation.region != region;
            })
        }
        updatePlot();
    })

    d3.select("#year_slider").on("input", function() {
        // subtract 1950 because 1950 is index 0
        year_idx = parseInt(document.getElementById("year_slider").value) - 1950;
        updatePlot();
    })
})

