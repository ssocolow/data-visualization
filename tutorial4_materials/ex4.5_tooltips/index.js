import { scatterPlot }  from './scatterplot.js';
const svg = d3.select('svg');

// Global/state variables
let data;

const updateVis = () => {

  // refresh scatterPlot
  svg.call(scatterPlot, {
    data,
    margin: { top: 40, bottom: 50, left: 30, right: 20 },
    xValue: d => d.distance,
    xAxisLabel: 'Distance',
    yValue: d => d.time,
    yAxisLabel: 'Hours',
    colourValue: d => d.difficulty,
    circleRadius: 4
  });
};

d3.csv('vancouver_trails.csv')
  .then(loadedData => {                 // Data loading
    data = loadedData;
    data.forEach(d => {                 // Data parsing
      d.time = +d.time;
      d.distance = +d.distance;
    });
    updateVis();                        // Init visualisation
  });

