var svg = d3.select("#sort-viz").append("svg")
            .attr("width", "100%")
            .attr("height", "100%");

var sortType = setSortType(),
    currSortType = 'insertion';

var colorArr = [], start = 28;
while (start < 330) {
  colorArr.push(start += 3);
}
shuffle();

svg.append("line")
  .attr("id", "left-line")
  .attr("x1", sortType[currSortType])
  .attr("y1", 10)
  .attr("x2", 10)
  .attr("y2", 130)
  .style("stroke", "black");

svg.append("line")
  .attr("id", "right-line")
  .attr("x1", sortType[currSortType])
  .attr("y1", 10)
  .attr("x2", (getWidth() - 10))
  .attr("y2", 130)
  .style("stroke", "black");

var rectWidth = ((getWidth() - 20) / colorArr.length);
var rects = svg.selectAll('rect').data(colorArr).enter().append('rect')
              .attr('width', rectWidth)
              .attr('height', 10)
              .attr('transform', function (d, i) {
                return 'translate(' + (10 + (rectWidth * i)) + ',140)';
              })
              .style("fill", function (d) {
                return "hsl(" + d + ",100%,60%)";
              });

insertion();

d3.select(window).on("resize", function () {
  resizeSvg();
});

d3.select("#nav-insertion").on("click", function () {
  clearInterval(animate);
  svg.selectAll("rect").remove();
  currSortType = 'insertion';
  svg.selectAll("line")
    .transition()
    .duration(1000)
    .attr("x1", sortType[currSortType]);
  shuffle();
  rects = svg.selectAll('rect').data(colorArr).enter().append('rect')
            .attr('width', rectWidth)
            .attr('height', 10)
            .attr('transform', function (d, i) {
              return 'translate(' + (10 + (rectWidth * i)) + ',140)';
            })
            .style("fill", function (d) {
              return "hsl(" + d + ",100%,60%)";
            });
  insertion();
});

d3.select("#nav-merge").on("click", function () {
  clearInterval(animate);
  svg.selectAll("rect").remove();
  currSortType = 'merge';
  svg.selectAll("line")
    .transition()
    .duration(1000)
    .attr("x1", sortType[currSortType]);
  shuffle();
  rects = svg.selectAll('rect').data(colorArr).enter().append('rect')
            .attr('width', rectWidth)
            .attr('height', 10)
            .attr('transform', function (d, i) {
              return 'translate(' + (10 + (rectWidth * i)) + ',140)';
            })
            .style("fill", function (d) {
              return "hsl(" + d + ",100%,60%)";
            });
  merge();
});

d3.select("#nav-quick").on("click", function () {
  clearInterval(animate);
  svg.selectAll("rect").remove();
  currSortType = 'quick';
  svg.selectAll("line")
    .transition()
    .duration(1000)
    .attr("x1", sortType[currSortType]);
  shuffle();
  rects = svg.selectAll('rect').data(colorArr).enter().append('rect')
            .attr('width', rectWidth)
            .attr('height', 10)
            .attr('transform', function (d, i) {
              return 'translate(' + (10 + (rectWidth * i)) + ',140)';
            })
            .style("fill", function (d) {
              return "hsl(" + d + ",100%,60%)";
            });
  quick();
});

function shuffle() {
  var m = colorArr.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = colorArr[m];
    colorArr[m] = colorArr[i];
    colorArr[i] = t;
  }
}

function insertion () {
  var actions = [];

  for (var i = 1; i < colorArr.length; i++) {
    var key = colorArr[i];
    var j = i - 1;
    while (j >= 0 && colorArr[j] > key) {
      colorArr[j+1] = colorArr[j];
      actions.push({old: j, new: j+1})
      --j;
    }
    colorArr[j+1] = key;
  }

  var reversed = actions.reverse();

  animate = setInterval(function () {
    var action = reversed.pop();
    if (action) {
      var temp = rects['_groups'][0][action.new];
      rects['_groups'][0][action.new] = rects['_groups'][0][action.old];
      rects['_groups'][0][action.old] = temp;
      rects.attr("transform", function (d, i) {
        return "translate(" + (10 + (rectWidth * i)) + ",140)";
      });
    } else {
      clearInterval(animate);
    }
  }, 10);
}

function merge () {
  var passes = [];
  var depthDict = {};

  divide(colorArr, 0, colorArr.length-1, 0);

  for (var key in depthDict) {
    passes.push(depthDict[key]);
  }

  animate = setInterval(function () {
    var pass = passes.pop();
    if (pass) {
      rects.data(pass, Number)
        .transition()
        .duration(1000)
        .attr('transform', function (d, i) {
          return 'translate(' + (10 + (rectWidth * i)) + ',140)';
        });
    } else {
      clearInterval(animate);
    }
  }, 1000);

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
}

function quick () {
  var passes = [];
  var depthDict = {};

  divide(colorArr, 0, colorArr.length-1, 0);

  for (var key in depthDict) {
    passes.push(depthDict[key]);
  }

  animate = setInterval(function () {
    var pass = passes.pop();
    if (pass) {
      rects.data(pass, Number)
        .transition()
        .duration(500)
        .attr('transform', function (d, i) {
          return 'translate(' + (10 + (rectWidth * i)) + ',140)';
        });
    } else {
      clearInterval(animate);
    }
  }, 500);

  function divide (data, lo, hi, depth) {
    if (lo < hi) {
      var p = partition(data, lo, hi);
      divide(data, lo, p-1, depth+1);
      divide(data, p+1, hi, depth+1);
    }
  }

  function partition (data, lo, hi) {
    var pivot = data[hi],
        i = lo;
    for (var j = lo; j < hi; j++) {
      if (data[j] < pivot) {
        var temp = data[i];
        data[i] = data[j];
        data[j] = temp;
        i++;
      }
    }
    var temp = data[i];
    data[i] = pivot;
    data[hi] = temp;
    return i;
  }
}

function setSortType () {
  return {
    insertion: ((getWidth() / 3) / 2),
    merge: (getWidth() / 2),
    quick: (getWidth() - ((getWidth() / 3) / 2))
  };
}

function getWidth () {
  return parseInt(d3.select("#sort-viz").style("width"));
}

function resizeSvg () {
  sortType = setSortType();
  rectWidth = ((getWidth() - 20) / colorArr.length);
  svg.attr("width", getWidth());
  svg.selectAll("line#left-line")
    .attr("x1", sortType[currSortType])
    .attr("y1", 10)
    .attr("x2", 10)
    .attr("y2", 130)
    .style("stroke", "black");
  svg.selectAll("line#right-line")
    .attr("x1", sortType[currSortType])
    .attr("y1", 10)
    .attr("x2", (getWidth() - 10))
    .attr("y2", 130)
    .style("stroke", "black");
  svg.selectAll("rect")
    .attr("width", rectWidth)
    .attr('transform', function (d, i) {
      return 'translate(' + (10 + (rectWidth * i)) + ',140)';
    });
}
