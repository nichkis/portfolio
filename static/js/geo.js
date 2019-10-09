var legend = Array.from(Array(231)).map((e, i) => { return 40 + i; });

var widthl = d3.select("#mapl").node().getBoundingClientRect().width,
    widthr = d3.select("#mapr").node().getBoundingClientRect().width,
    widthm = d3.select("#legend").node().getBoundingClientRect().width;

var svg1 = d3.select("#mapl").append("svg")
            .attr("id", "svg1")
            .attr("width", widthl - 10)
            .attr("height", 400)
            .attr("transform", "translate(5,5)");

var svg2 = d3.select("#mapr").append("svg")
            .attr("id", "svg2")
            .attr("width", widthr - 10)
            .attr("height", 400)
            .attr("transform", "translate(5,5)");

var svg3 = d3.select("#legend").append("svg")
            .attr("id", "svg3")
            .attr("width", widthm - 10)
            .attr("height", 400)
            .attr("transform", "translate(0,50)");

svg3.selectAll("rect").data(legend).enter().append("rect")
  .attr("width", 10)
  .attr("height", 300 / 231)
  .style("fill", function (d) {
    return "hsl(" + d + ",100%,60%)";
  })
  .attr("transform", function (d, i) {
    return "translate(" + ((widthm / 2) - 5) + "," + (((300 / 231) * i) + 50) + ")"
  });

Promise.all([d3.json("viz-geo/2006thru2010.geo.json"), d3.json("viz-geo/2011thru2015.geo.json")])
  .then(function (data) {
    var minmaxpopl = minmaxpop(data[0]),
        minmaxpopr = minmaxpop(data[1]);

    var absminmax = [
      Math.min(minmaxpopl[0], minmaxpopr[0]),
      Math.max(minmaxpopl[1], minmaxpopr[1])
    ];

    svg3.append("text")
      .attr("x", widthm / 2)
      .attr("y", 45)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text(absminmax[0]);

    svg3.append("text")
      .attr("x", widthm / 2)
      .attr("y", 362)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text(absminmax[1]);

    var projectionl = d3.geoMercator().fitSize([widthl - 10, 400], data[0]),
        projectionr = d3.geoMercator().fitSize([widthr - 10, 400], data[1]);

    svg1.append("g").selectAll("path")
      .data(data[0].features)
      .enter()
      .append("path")
      .attr("d", d3.geoPath().projection(projectionl))
      .attr("stroke", "black")
      .attr("fill", function (d) {
        var colormap = 40+((d.properties.PCT_WHITE*230)/(absminmax[1]-absminmax[0]));
        return "hsl(" + colormap + ",100%,60%)";
      })
      .on("mouseover", function (d) {
        // console.log(d.properties.NBHD_NAME, d.properties);
      });

    svg2.append("g").selectAll("path")
      .data(data[1].features)
      .enter()
      .append("path")
      .attr("d", d3.geoPath().projection(projectionr))
      .attr("stroke", "black")
      .attr("fill", function (d) {
        var colormap = 40+((d.properties.PCT_WHITE*230)/(absminmax[1]-absminmax[0]));
        return "hsl(" + colormap + ",100%,60%)";
      })
      .on("mouseover", function (d) {
        // console.log(d.properties.NBHD_NAME, d.properties.PER_CAPITA);
      });
  });

function minmaxpop (data) {
  return data.features.reduce(function (acc, curr) {
      var min = curr.properties.PCT_WHITE < acc[0] ? curr.properties.PCT_WHITE : acc[0],
          max = curr.properties.PCT_WHITE > acc[1] ? curr.properties.PCT_WHITE : acc[1];
      return [min, max];
  }, [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]);
}
