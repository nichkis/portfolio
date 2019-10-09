(function () {
  var svgMargin = 20;
  var rectWidth = 10;
  var passes = [];
  var depth = 0;
  var depthDict = {};

  var xScale, rects;

  init();

  function init () {
    d3.selectAll('svg').remove();

    var svg = d3.select('#content').append('svg')
      .attr("width", "100%")
      .attr("height", 40);

    var svgWidth = d3.select('svg').node().getBoundingClientRect().width;

    var length = Math.floor((svgWidth-(svgMargin*2))/rectWidth);
    var data = [];
    while (data.length < length) {
      var el = Math.floor((Math.random()*360));
      if (data.indexOf(el) === -1) data.push(el);
    };

    xScale = d3.scaleLinear().domain([0,data.length]).range([20,svgWidth-20])

    rects = svg.selectAll('rect').data(data).enter().append('rect')
      .attr('width', rectWidth)
      .attr('height', 20)
      .attr('transform', function (d, i) {
        return 'translate(' + xScale(i) + ',20)';
      })
      .style("fill", function (d) {
        return "hsl(" + d + ",100%,60%)";
      });

    divide(data, 0, data.length-1, 0);

    for (var key in depthDict) {
      passes.push(depthDict[key]);
    }

    animate();

    function animate () {
      var pass = passes.pop();
      if (pass) {
        rects.data(pass, Number)
          .transition()
          .duration(2000)
          .attr('transform', function (d, i) {
            return 'translate(' + xScale(i) + ',20)';
          });
        setTimeout(animate, 2000);
      }
    }
  }

  function divide (data, p, r, depth) {
    if (p < r) {
      var q = Math.floor((p+r)/2);
      divide(data, p, q, depth+1);
      divide(data, q+1, r, depth+1);
      sort(data, p, q, r);
      if (!depthDict[depth]) {
        depthDict[depth] = [];
      }
      for (var k = p; k <= r; k++) {
        depthDict[depth][k] = data[k];
      }
    }
  }

  function sort (data, p, q, r) {
    var i = p,
        j = q+1;
    while (i < j && j <= r) {
      if (data[i] > data[j]) {
        var pivot = data[i];
        data[i] = data[j];

        for (var k = j; k > i + 1; k--) {
          data[k]=data[k-1];
        }

        data[i+1] = pivot;
        i++;
        j++;
      } else {
        i++;
      }
    }
  }
})();
