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

  // Create matrix string from data points
  const xMatrix = data.map(point => `1 & ${point.x.toFixed(2)}`).join(' \\\\ ');
  const yVector = data.map(point => point.y.toFixed(2)).join(' \\\\ ');
  const matrixStr = data.length > 0
    ? `\\begin{bmatrix}${xMatrix}\\end{bmatrix} \\begin{bmatrix}b \\\\ m\\end{bmatrix} = \\begin{bmatrix}${yVector}\\end{bmatrix}`
    : 'empty-matrix';

  // refresh math using MathJax
  d3.select('#math').html(`
    <p>\\[${matrixStr}\\]</p>`)
    .each(() => { MathJax.typesetPromise() });
};

updateVis();
