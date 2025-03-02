const svg = d3.select('#area-chart');
let data, stackedAreaChart;
let displayType; // 'absolute' || 'relative'


// Load data from CSV file and render area chart
d3.csv('data/freshwater-use-by-aggregated-region.csv')
  .then(loadedData => {
    data = loadedData;
    data.forEach(d => {
      d.year = +d.year;
      d.freshwater_use = +d.freshwater_use/1e12; // to trillions
    });

    // Initialise and render chart
    displayType = 'absolute';
    stackedAreaChart = new StackedAreaChart(svg, {
      data,
      margin: {top: 30, bottom: 25, left: 40, right: 20},
      displayType
    });
    stackedAreaChart.updateVis();

    // Note: subsequent changes in state can be implemented as:
    // stackedAreaChart.props.displayType = displayType;
    // stackedAreaChart.updateVis();
    d3.select('#display-type-selection').on('change', function() {
      displayType = d3.select(this).property('value');
      console.log(displayType);
      stackedAreaChart.props.displayType = displayType;
      stackedAreaChart.updateVis();
    });
  })
  .catch(error => console.error(error));
