var gieStainColor = {
  2014: "rgb(27,94,32)",
  2015: "rgb(51,105,30)",
  2016: "rgb(130,119,23)",
  2017: "rgb(245,127,23)",
  2018: "rgb(255,111,0)"
};
var global_data;
var buildData = function(rawData1, karyotype) {
  var binLength = 1700;
  var data = [];

  var rawDataByChr1 = d3
    .nest()
    .key(function(d) {
      return d.country;
    })
    .entries(rawData1);
  // console.log(rawDataByChr1);

  karyotype.forEach(function(chr) {
    var raw1 = rawDataByChr1.filter(function(d) {
      return d.key === chr.id;
    })[0].values;
    d3.range(0, chr.len, binLength).forEach(function(position) {
      var counter = 0;
      raw1.forEach(function(datum) {
        data.push({
          block_id: chr.id,
          start: position++,
          end: position,
          value: +datum.value,
          year: +datum.year
        });
      });
    });
  });
  console.log("DATA::::", data);
  global_data = data;
  return data;
};

var buildData_text = function(rawData1) {
  var data = [];
  var i = 0;
  rawData1.forEach(element => {
    i++;
    data.push({
      block_id: element.block_id,
      position: i / 2,
      value: +element.gieStain
    });
  });
  return data;
};

var drawCircos = function(error, GRCh37, cytobands, es) {
  // var width = document.getElementsByClassName('mdl-card__supporting-text')[0].offsetWidth
  var width = 800;
  var circos = new Circos({
    container: "#histogramChart",
    width: width,
    height: width
  });

  cytobands = cytobands.map(function(d) {
    return {
      block_id: d.name,
      start: parseInt(d.chromStart),
      end: parseInt(d.chromEnd),
      gieStain: d.gieStain,
      name: d.name
    };
  });

  circos
    .layout(GRCh37, {
      innerRadius: width / 2 - 60,
      outerRadius: width / 2 - 55,
      labels: {
        display: true
      },
      ticks: {
        display: false
      }
    })
    .histogram("histogram", buildData(es, GRCh37), {
      innerRadius: 0.5,
      outerRadius: 1,
      color: "RdPu",
      tooltipContent: function(d) {
        return `${d.block_id}:${d.value}:\nYEAR:${d.year}`;
      },
      axes: [
        {
          color: "black",
          position: 1.02,
          thickness: 2, // in pixel
          opacity: 0.3 // between 0 and 1
        }
      ]
    })
    .text(
      "histogram-labels",
      global_data.map(d => {
        return {
          block_id: d.block_id,
          position: d.end,
          value: d.year
        };
      }),
      {
        innerRadius: 0.6,
        outerRadius: 0.7,
        style: {
          "font-size": 1
        },
        color: "rgb(130,119,23)"
      }
    )
    .render();
  d3.select("svg")
    .append("text")
    .attr("x", 380)
    .attr("y", 410)
    .text("Time").attr("font-family", "sans-serif").attr("font-size", "20px");
  
};

d3.queue()
  .defer(d3.json, "./data/test.json")
  .defer(d3.csv, "./data/cytobands.csv")
  .defer(d3.csv, "./data/es.csv")
  .await(drawCircos);
