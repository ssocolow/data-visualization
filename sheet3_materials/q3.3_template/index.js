import { areaChart }  from './areaChart.js';
const svg = d3.select('svg');

// Global/state variables
let data;

const updateVis = () => {
  // refresh scatterPlot
  svg.call(areaChart, {
    data,
    margin: { top: 80, bottom: 40, left: 90, right: 40 },
    xValue: d => d.date,
    yValue: d => d.close,
    title: 'S&P 500 Index'
  });
};

d3.csv('sp-500-index.csv')
  .then(loadedData => {                 // Data loading
    data = loadedData;
    data.forEach(d => {                 // Data parsing
      d.date = new Date(d.date);
      d.close = +d.close;
    });
    updateVis();                        // Init visualisation
  });