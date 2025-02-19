import { scatterPlot }  from './scatterplot.js';
// import { dropdownMenu } from './dropdownMenu.js';
const svg = d3.select('svg');

// Global/state variables
let data = [];
//...

function clearPoints() {
  data = [];
  updateVis();
}
d3.select('#clear-button').on('click', clearPoints);

function addPoint(x, y) {
  data.push({ x, y });
  updateVis();
}

const updateVis = () => {
  console.log(data);

  // refresh scatterPlot
  svg.call(scatterPlot, {
    data,
    addPoint,
    margin: { top: 50, bottom: 80, left: 150, right: 40 },
    circleRadius: 10
  });
};

updateVis();
