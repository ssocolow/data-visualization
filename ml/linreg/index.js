import { scatterPlot }  from './scatterplot.js';
// import { dropdownMenu } from './dropdownMenu.js';
const svg = d3.select('svg');

// Global/state variables
let data = [];
let param1 = 'b';
let param2 = 'm';
let drawLine = false;

function clearPoints() {
  data = [];
  updateVis();
}
d3.select('#clear-button').on('click', clearPoints);
d3.select('#linear-button').on('click', makeLinearPrediction);

function makeLinearPrediction() {
  // data is array of objects with x and y
  // use the linear regression formula to find the optimal parameters
  // w = (X_t * X)^-1 * X_t * y
  // where X is the matrix of features (1, x) and y is the vector of y values
  // Define matrices
  const X = [];
  for (let d of data) {
    X.push([1, d.x]);
  }

  const y = data.map(d => d.y);

  // Matrix multiplication
  const X_t = math.transpose(X);
  const X_tX = math.multiply(X_t, X);
  const X_tX_inv = math.inv(X_tX);
  const X_ty = math.multiply(X_t, y);
  const X_tX_inv_X_ty = math.multiply(X_tX_inv, X_ty);
  console.log("params", X_tX_inv_X_ty);
  param1 = X_tX_inv_X_ty[0].toFixed(2);
  param2 = X_tX_inv_X_ty[1].toFixed(2);
  drawLine = true;
  updateVis();
}

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
    circleRadius: 10,
    drawLine,
    param1,
    param2
  });

  // Create matrix string from data points
  const xMatrix = data.map(point => `1 & ${point.x.toFixed(2)}`).join(' \\\\ ');
  const yVector = data.map(point => point.y.toFixed(2)).join(' \\\\ ');
  const matrixStr = data.length > 0
    ? `\\overset{\\text{xData}}{\\begin{bmatrix}${xMatrix}\\end{bmatrix}} \\overset{\\text{Parameters}}{\\begin{bmatrix}${param1} \\\\ ${param2}\\end{bmatrix}} = \\overset{\\text{yData (Trying to predict)}}{\\begin{bmatrix}${yVector}\\end{bmatrix}}`
    : 'empty-matrix';

  // refresh math using MathJax
  d3.select('#math').html(`
    <p>\\[${matrixStr}\\]</p>`)
    .each(() => { MathJax.typesetPromise() });
};

updateVis();
