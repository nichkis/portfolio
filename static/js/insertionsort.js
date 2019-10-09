function insertionSort(data) {
  var actions = [];
  for (var i = 1; i < data.length; i++) {
    var key = data[i];
    var j = i - 1;
    while (j >= 0 && data[j] > key) {
      data[j+1] = data[j];
      actions.push({old: j, new: j+1})
      --j;
    }
    data[j+1] = key;
  }
  return actions;
}

var insertionData = Array.from(data);

var x = d3.scale.ordinal().domain(index).rangePoints([0, 500]);

var svg = d3.select("#insertion").append("svg").attr("width", 500).attr("height", 10);
var rects = svg.selectAll("rect").data(insertionData).enter().append("rect")
  .attr("index", function (d, i) { return "i" + i; })
  .attr("width", 5)
  .attr("height", 10)
  .attr("transform", function(d, i) {
    return "translate(" + x(i) + ")";
  })
  .style("fill", function (d) {
    return "hsl(" + d + ",100%,60%)";
  });

var actions = insertionSort(insertionData).reverse();

setInterval(function () {
  var action = actions.pop();
  if (action) {
    var temp = rects[0][action.new];
    rects[0][action.new] = rects[0][action.old];
    rects[0][action.old] = temp;
    rects.attr("transform", function (d, i) {
      return "translate(" + x(i) + ")";
    });
  }
}, 10);
