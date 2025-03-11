import { scatterPlot }  from './scatterplot.js';
// import { dropdownMenu } from './dropdownMenu.js';
const svg = d3.select('svg');

// Global/state variables
let data = [];
let param1 = 'b';
let param2 = 'm';
let drawLine = false;
let chosenAlgo = "linear";
let redData = [];
let blueData = [];

function clearPoints() {
  data = [];
  updateVis();
}
d3.select('#clear-button').on('click', clearPoints);
d3.select('#solve-params-button').on('click',function() {
  console.log(chosenAlgo);
  if (chosenAlgo === "linear") {
    makeLinearPrediction();
  } else if (chosenAlgo === "logistic") {
    makeLogisticPrediction();
  } else if (chosenAlgo === "svm") {
    makeSVMPrediction();
  }
});
d3.select('#algorithm-select').on('change', function() {
  chosenAlgo = this.value;
  console.log('algo changed to', chosenAlgo);
  
  // Clear previous classification data
  redData = [];
  blueData = [];
  
  if (chosenAlgo === "logistic") {
    drawLine = false;
    // Now: points above y=x are blue (class 1), points below are red (class 0)
    for (let d of data) {
      if (d.y >= d.x) {
        blueData.push(d);
      } else {
        redData.push(d);
      }
    }
    // show the blue-or-red selector
    d3.select('#red-or-blue').style('display', 'block');
  }
  else {
    d3.select('#red-or-blue').style('display', 'none');
  }
  updateVis();
});

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

function sigmoid(x) {
  return 1/(1+Math.exp(-x));
}

function makeLogisticPrediction() {
  console.log("making logistic prediction");
  let weights = [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1];
  console.log("initial weights", weights);
  
  // Get the width and height from the SVG and account for margins properly
  const margin = { top: 50, right: 40, bottom: 80, left: 150 };
  const width = +svg.attr('width') - margin.left - margin.right;
  const height = +svg.attr('height') - margin.top - margin.bottom;
  
  // Get or recreate the scales
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.x)])
    .range([0, width]);
    
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.y)])
    .range([height, 0]);

  // Create a grid of points for the heatmap
  const gridSize = 20;
  const xStep = width / gridSize;
  const yStep = height / gridSize;
  
  // Normalize the data
  const allX = [...redData, ...blueData].map(d => d.x);
  const allY = [...redData, ...blueData].map(d => d.y);
  const xMean = d3.mean(allX);
  const yMean = d3.mean(allY);
  const xStd = d3.deviation(allX) || 1;
  const yStd = d3.deviation(allY) || 1;
  
  function normalizeX(x) { return (x - xMean) / xStd; }
  function normalizeY(y) { return (y - yMean) / yStd; }
  
  let iteration = 0;
  let interval = setInterval(() => {
    iteration++;
    console.log("\nIteration", iteration);
    
    // calculate loss
    let loss = 0;
    console.log("Current weights:", weights);
    
    // get predictions on the red points
    let predictions = [];
    for (let d of redData) {
      // Invert y for gradient descent to match SVG coordinates
      const normalized_input = weights[0] * normalizeX(d.x) + weights[1] * normalizeY(-d.y) + weights[2];
      const s = sigmoid(normalized_input);
      predictions.push(s);
      loss += Math.log(1 - s);  // red is class 0, want high probability of 0 (low s)
    }
    console.log("red points predictions", predictions);

    // get predictions on the blue points
    predictions = [];
    for (let d of blueData) {
      // Invert y for gradient descent to match SVG coordinates
      const normalized_input = weights[0] * normalizeX(d.x) + weights[1] * normalizeY(-d.y) + weights[2];
      const s = sigmoid(normalized_input);
      predictions.push(s);
      loss += Math.log(s);      // blue is class 1, want high probability of 1 (high s)
    }
    console.log("blue points predictions", predictions);
    
    loss = -1 * loss / (redData.length + blueData.length);
    console.log("loss", loss);

    // calculate gradient with normalized data
    let gradient = [0, 0, 0];
    for (let d of redData) {
      const normalized_input = weights[0] * normalizeX(d.x) + weights[1] * normalizeY(-d.y) + weights[2];
      const s = sigmoid(normalized_input);
      gradient[0] += (s - 0) * normalizeX(d.x);
      gradient[1] += (s - 0) * normalizeY(-d.y);  // Note the negative y
      gradient[2] += (s - 0);
    }
    for (let d of blueData) {
      const normalized_input = weights[0] * normalizeX(d.x) + weights[1] * normalizeY(-d.y) + weights[2];
      const s = sigmoid(normalized_input);
      gradient[0] += (s - 1) * normalizeX(d.x);
      gradient[1] += (s - 1) * normalizeY(-d.y);  // Note the negative y
      gradient[2] += (s - 1);
    }
    gradient = gradient.map(g => g / (redData.length + blueData.length));
    console.log("gradient:", gradient);
    
    // update weights
    const learning_rate = 0.1;
    weights[0] -= gradient[0] * learning_rate;
    weights[1] -= gradient[1] * learning_rate;
    weights[2] -= gradient[2] * learning_rate;
    
    // Create grid of probabilities
    const gridPoints = [];
    for (let i = 0; i <= gridSize; i++) {
      for (let j = 0; j <= gridSize; j++) {
        // Get data space coordinates
        const x = xScale.invert(i * xStep);
        const y = yScale.invert(j * yStep);
        
        const normalized_input = weights[0] * normalizeX(x) + weights[1] * normalizeY(-y) + weights[2];
        const s = sigmoid(normalized_input);
        
        gridPoints.push({
          x: margin.left + i * xStep,
          y: margin.top + j * yStep,
          dataX: x,
          dataY: y,
          probability: s
        });
      }
    }

    // Sort grid points so lower probabilities (red) are drawn on top
    gridPoints.sort((a, b) => a.probability - b.probability);

    // Update visualization using SVG rectangles
    const cells = svg.selectAll('.heatmap-cell')
      .data(gridPoints);
    
    cells.enter()
      .append('rect')
      .attr('class', 'heatmap-cell')
      .merge(cells)
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width', xStep + 1)
      .attr('height', yStep + 1)
      .style('fill', d => {
        if (d.probability > 0.5) {
          const blueIntensity = Math.floor(255 * (0.5 + d.probability/2));
          return `rgb(0,0,${blueIntensity})`;
        } else {
          const redIntensity = Math.floor(255 * (1 - d.probability));
          return `rgb(${redIntensity},0,0)`;
        }
      })
      .style('opacity', 0.8);

    cells.exit().remove();
    
    // Make sure points are drawn on top
    svg.selectAll('circle').raise();
    
    updateVis();
  }, 100);

  setTimeout(() => {
    clearInterval(interval);
    // Clean up heatmap cells when done
    // svg.selectAll('.heatmap-cell').remove();
  }, 8000);
}

function makeSVMPrediction() {
  return "not yet";
}

function addPoint(x, y) {
  data.push({ x, y });
  updateVis();
}

const updateVis = () => {
  console.log("Updating visualization");
  // refresh scatterPlot
  svg.call(scatterPlot, {
    data,
    addPoint,
    margin: { top: 50, bottom: 80, left: 150, right: 40 },
    circleRadius: 10,
    drawLine,
    param1,
    param2,
    redData,
    blueData,
    chosenAlgo,
    preserveGradient: true
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
