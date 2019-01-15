var height = 500,
    width = 1000,
    margin = {
        left: 120,
        right: 20,
        top: 20,
        bottom: 70

    }

var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json",
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    color = ["#ef5350", "#EC407A", "#AB47BC", "#7E57C2", "#5C6BC0", "#42A5F5", "#26C6DA", "#26A69A", "#D4E157", "#FFEE58", "#FFA726"]


document.addEventListener("DOMContentLoaded", function() {
    var canvas = d3.select("svg").attr("width", margin.left + width + margin.right)
        .attr("height", margin.top + height + margin.bottom)
    console.log(canvas)
    var group = canvas.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    var div = d3.select(".tooltip")
    var xScale = d3.scaleTime().range([0, width])
    var yScale = d3.scaleBand().domain(months).range([height, 0])
    var colorScale = d3.scaleQuantize().range(color)

    d3.json(url).then(function(data) {


        dataset = data.monthlyVariance
        dataset.map(function(d) {
            d.month = months[d.month - 1];
            d.year = d3.timeParse("%Y")(d.year.toString());

        })
        console.log(dataset)
        xScale.domain(d3.extent(dataset, function(d) {
            return d.year
        }))
        colorScale.domain(d3.extent(dataset, function(d) {
            return d.variance
        }))

        var barWidth = width / (dataset.length / 12)
        var barHeight = height / 12
        var xAxis = d3
            .axisBottom(xScale)
            .tickFormat(d3.timeFormat('%Y'))
        var yAxis = d3.axisLeft(yScale).ticks(12)
        console.log(xAxis)
        group.append("g").attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
        group.append("g").attr("class", "y-axis")
            .call(yAxis)


        group.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("transform", function(d) {
                // console.log(d.year, d.month)
                return "translate(" + xScale(d.year) + "," + yScale(d.month) + ")"
            }).attr("height", yScale.bandwidth())
            .attr("width", barWidth)
            .style("fill", function(d) {
                return colorScale(d.variance)
            })
            .on("mouseover", function(d) {
                div.transition()
                    .duration(10)
                    .style("opacity", 0.8)
                    .style("top", d3.event.pageY + "px")
                    .style("left", d3.event.pageX + "px")
                div.html("<p>Year:" + d3.timeFormat("%Y")(d.year) + "</p><p>value = " + (8.66 + d.variance).toFixed(2) + "</p><p>month:" + d.month + "</p>")
            })
            .on("mouseout", function(d) {
                div.transition().duration(100).style("opacity", 0)
            })
    })


})