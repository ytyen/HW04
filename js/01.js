// 1. 定義width, height, padding, letterList變數
var w = 1000;
var h = 600;
var padding = 100;
var letterList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "M", "N", "O", "P", "Q", "T", "U", "V",
  "W", "X", "Z"
];

//2. 建立svg()畫布環境

svg1();

function mid(d) {
  d.amount = +d.amount || 0;
  d.number = +d.number || 0;
  return d;
}

//3. 用d3讀取csv
d3.csv("data/invoice.csv", mid, function (dataSet) {

  bind1(dataSet);
  render1(dataSet);
  btnList(dataSet);

});

function svg1() {
  d3.select("#block1").append("svg").attr({
    width: w,
    height: h
  });
  d3.select("#block1 svg").append("g").append("rect").attr({
    width: "100%",
    height: "100%",
    fill: "white"
  });
  d3.select('#block1 svg')
    .append('g')
    .classed('axis', true)
    .attr('id', 'axisX');
  d3.select('#block1 svg')
    .append('g')
    .classed('axis', true)
    .attr('id', 'axisY');
}

//4. 建立bind()

function bind1(dataSet) {
  var selection = d3.select("#block1 svg")
    .selectAll("circle")
    .data(dataSet);

  selection.enter().append("circle");
  selection.exit().remove();
}

function render1(dataSet) {
  //5. 定義xScale,yScale,rScale, fScale比例尺(range目的在決定在svg上位置)

  var xScale = d3.time.scale()
    .domain([
      new Date("2013-01-01"),
      new Date("2016-08-01")
    ])
    .range([padding, w - padding]);
  var yScale = d3.scale.linear()
    .domain([
      0,
      d3.max(dataSet, function (d) {
        return d.number
      })
    ])
    .range([h - padding, padding]);
  var rScale = d3.scale.linear()
    .domain([
      d3.min(dataSet, function (d) {
        return d.amount;
      }),
      d3.max(dataSet, function (d) {
        return d.amount;
      })
    ])
    .range([5, 30]);
  var fScale = d3.scale.category20();

  // Axis
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom');
  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left');

  //6. 建立render()繪圖
  d3.select("#block1").selectAll("circle")
    .transition()
    .attr({
      cx: function (d) {
        return xScale(new Date(d.date));
      },
      cy: function (d) {
        return yScale(d.number);
      },
      r: function (d) {
        return rScale(d.amount);
      },
      fill: function (d, i) {
        return fScale(d.cid);
      },
      stroke: '#666666',
      'stroke-width': 1
    });

  // d3.select("#block1").selectAll("circle")
  //   .append('title').text(function (d) {
  //     return d.city + "\r\n" + d.industry;
  //   });
  d3.select("#block1").selectAll("circle")
    .on('mouseover', function (d) {
      var posX = d3.select(this).attr('cx');
      var posY = d3.select(this).attr('cy');
      var tooltip = d3.select('#tooltip1')
        .style({
          left: (+posX + 20) + 'px',
          top: (+posY + 20) + 'px'
        });
      tooltip.select('#city').text(d.city);
      tooltip.select('#industry').text(d.industry);
      tooltip.classed('hidden', false);
    })
    .on('mouseout', function (d) {
      d3.select('#tooltip1').classed('hidden', true);
    });

  d3.select('#block1 #axisX')
    .attr('transform', 'translate(0,' + (h - padding + 20) + ')')
    .call(xAxis);

  d3.select('#block1 #axisY')
    .attr('transform', 'translate(' + (padding - 20) + ',0)')
    .call(yAxis);
}

function unique(array) {
  var n = [];
  for (var i = 0; i < array.length; i++) {
    if (n.indexOf(array[i]) == -1) {
      n.push(array[i]);
    }
  }
  return n;
}

function btnList(dataSet) {
  var industryArr = dataSet.map(function (d) {
    return d.industry;
  });
  var uIndustryArr = unique(industryArr);

  var fIndustryArr = uIndustryArr.filter(function (d) {
    return d != '';
  });

  // var selection = d3.select('#block1')
  //   .append('div')
  //   .selectAll('input')
  //   .data(fIndustryArr);
  // selection.enter().append('input')
  //   .attr({
  //     type: 'button',
  //     value: function (d) {
  //       return d;
  //     }
  //   })
  //   .on('click', function (d) {
  //     update1(d);
  //   });
  // selection.exit().remove();

  var selection = d3.select('#block1')
    .append('select')
    .selectAll('option')
    .data(fIndustryArr);
  selection.enter().append('option')
    .attr({
      value: function (d) {
        return d;
      }
    })
    .text(function (d) {
      return d;
    });
  selection.exit().remove();

  d3.select('#block1 select').on('change', function (d) {
    var value = d3.select('#block1 select').property('value');
    update1(value);
  });

  function update1(industry) {
    var newDataSet = dataSet.filter(function (d) {
      return d.industry == industry;
    });
    bind1(newDataSet);
    render1(newDataSet);
  }

  // d3.select("#block1").append('span').text(fIndustryArr);
}