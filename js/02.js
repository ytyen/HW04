// 1. 定義width, height, padding, letterList變數
var w = 1000;
var h = 600;
var padding = 100;
var letterList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "M", "N", "O", "P", "Q", "T", "U", "V",
  "W", "X", "Z"
];

//2. 建立svg()畫布環境

svg2();

function mid2(d) {
  d.date = +d.date || 0;
  d.count = +d.count || 0;
  d.avg_age = +d.avg_age || 0;
  d.mid_age = +d.mid_age || 0;
  d.crude_rate = +d.crude_rate || 0;
  return d;
}

//3. 用d3讀取csv
d3.csv("data/cancer_data.csv", mid2, function (dataSet) {

  bind2(dataSet);
  render2(dataSet);
  btnList2(dataSet);

});

function svg2() {
  d3.select("#block2").append("svg").attr({
    width: w,
    height: h
  });
  d3.select("#block2 svg").append("g").append("rect").attr({
    width: "100%",
    height: "100%",
    fill: "white"
  });
  d3.select('#block2 svg')
    .append('g')
    .classed('axis', true)
    .attr('id', 'axisX');
  d3.select('#block2 svg')
    .append('g')
    .classed('axis', true)
    .attr('id', 'axisY');
}

//4. 建立bind()

function bind2(dataSet) {
  var selection = d3.select("#block2 svg")
    .selectAll("circle")
    .data(dataSet);

  selection.enter().append("circle");
  selection.exit().remove();
}

function render2(dataSet) {
  //5. 定義xScale,yScale,rScale, fScale比例尺(range目的在決定在svg上位置)

  var xScale = d3.time.scale()
    .domain([
      0,
      d3.max(dataSet, function (d) {
        return d.crude_rate;
      })
    ])
    .range([padding, w - padding]);
  var yScale = d3.scale.linear()
    .domain([
      0,
      d3.max(dataSet, function (d) {
        return d.avg_age;
      })
    ])
    .range([h - padding, padding]);
  var rScale = d3.scale.linear()
    .domain([
      d3.min(dataSet, function (d) {
        return d.count;
      }),
      d3.max(dataSet, function (d) {
        return d.count;
      })
    ])
    .range([5, 10]);
  var fScale = d3.scale.category20();

  // Axis
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom');
  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left');

  //6. 建立render()繪圖
  d3.select("#block2").selectAll("circle")
    .transition()
    .attr({
      cx: function (d) {
        return xScale(d.crude_rate);
      },
      cy: function (d) {
        return yScale(d.avg_age);
      },
      r: function (d) {
        return rScale(d.count);
      },
      fill: function (d, i) {
        return fScale(d.city);
      },
      stroke: '#666666',
      'stroke-width': 1
    });

  d3.select("#block2").selectAll("circle")
    .on('mouseover', function (d) {
      var posX = d3.select(this).attr('cx');
      var posY = d3.select(this).attr('cy');
      var tooltip = d3.select('#tooltip2')
        .style({
          left: (+posX + 20) + 'px',
          top: (+posY + 20) + 'px'
        });
      tooltip.select('#city2').text(d.city);
      tooltip.select('#industry2').html(d.category + '<br>案例數：' + d.count);
      tooltip.classed('hidden', false);
    })
    .on('mouseout', function (d) {
      d3.select('#tooltip2').classed('hidden', true);
    });

  d3.select('#block2 #axisX')
    .attr('transform', 'translate(0,' + (h - padding + 20) + ')')
    .call(xAxis);

  d3.select('#block2 #axisY')
    .attr('transform', 'translate(' + (padding - 20) + ',0)')
    .call(yAxis);
}

function unique2(array) {
  var n = [];
  for (var i = 0; i < array.length; i++) {
    if (n.indexOf(array[i]) == -1) {
      n.push(array[i]);
    }
  }
  return n;
}

function btnList2(dataSet) {
  var catArr = dataSet.map(function (d) {
    return d.category;
  });
  var uCatArr = unique2(catArr);

  var fCatArr = uCatArr.filter(function (d) {
    return d != '';
  });

  var selection = d3.select('#block2')
    .append('select')
    .selectAll('option')
    .data(fCatArr);
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

  d3.select('#block2 select').on('change', function (d) {
    var category = d3.select('#block2 select').property('value');
    var newDataSet = dataSet.filter(function (d) {
      return d.category == category;
    });
    update2(newDataSet);
  });

  function update2(newDataSet) {
    // var newDataSet = dataSet.filter(function (d) {
    //   return d.category == category;
    // });
    bind2(newDataSet);
    render2(newDataSet);
  }

  d3.select('#timer').on('click', function (d) {
    var dateArr = unique2(dataSet.map(function (d) {
      return d.date;
    }));
    var i = 0;

    d3.select('#block2 svg').append('text')
    .attr({
      id: 'showYear',
      x: w-padding-400,
      y: h-padding,
      fill: 'black',
      opacity: 0.2,
      'font-size': 200
    });
    window.setInterval(function () {
      var category = d3.select('#block2 select').property('value');
      var newDataSet = dataSet.filter(function (d) {
        return d.category === category && d.date === dateArr[i];
      });
      update2(newDataSet);
      d3.select('#showYear').text(dateArr[i]);
      i++;
      if (i >= dateArr.length) {
        i = 0;
      }
    }, 1000);
  });

}