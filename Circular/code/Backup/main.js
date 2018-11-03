var width = 800;
var circos = new Circos({
  container: "#chart",
  width: width,
  height: width
});
var yearColor = {
    2014: 'rgb(0,0,0)',
    2015: 'rgb(0,0,0)',
    2016: 'rgb(130,130,130)',
    2017: 'rgb(160,160,160)',
    2018: 'rgb(200,200,200)'}

var drawChart = (error, countries, cytobands, species) => {
  cytobands = cytobands.map(d => {
    return {
      block_id: d.country,
      start: +d.start,
      end: +d.end,
      value: +d.year,
      name: +d.year
    };
  });
    console.log("Cytobands:", cytobands);

  var length = 30; // circumference

//   // data
//   var data = species.map(d => {
//     (d.block_id = 1), (d.start = 0);
//     d.end = +d.Value;
//     return d;
//   });

//   var configurations = {
//     innerRadius: null,
//     outerRadius: null,
//     min: null,
//     max: null,
//     color: "#fd6a62",
//     strokeColor: "#d3d3d3",
//     strokeWidth: 1,
//     direction: "out",
//     thickness: 10,
//     radialMargin: 2,
//     margin: 2,
//     opacity: 1,
//     logScale: false,
//     tooltipContent: null,
//     events: {}
//   };
  circos
    .layout(countries, {
      innerRadius: width / 2 - 50,
      outerRadius: width / 2 - 10,
      labels: {
        display: true
      },
      ticks: { display: false, labels: false, spacing: 0 }
      }).highlight('cytobands', cytobands, {
          innerRadius: width / 2 - 150,
          outerRadius: width / 2 - 120,
          opacity: 0.6,
          color: function (d) {
              return yearColor[+d.year]
          },
          tooltipContent: function (d) {
              return d.name
          }
      })
    .render();
};

d3.queue()
  .defer(d3.json, "./data/countries.json")
  .defer(d3.csv, "./data/cytobands.csv")
  .defer(d3.csv, "./data/species.csv")
  .await(drawChart);
