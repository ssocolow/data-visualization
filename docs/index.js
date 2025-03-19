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
let decisionBoundaryVisualPoints = [];
let NUM_DECISION_BOUNDARY_POINTS = 50;
let blueOrRed = "blue";

for (let i = -20; i <= 20; i+=1) {
  for (let j = -20; j <= 20; j+=1) {
    decisionBoundaryVisualPoints.push({
      x: i,
      y: j,
      probability: 0
    });
  }
}

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
d3.select('#blue-or-red').on('change', function() {
  if (blueOrRed === "blue") {
    blueOrRed = "red";
  } else {
    blueOrRed = "blue";
  }
  console.log(blueOrRed);
  updateVis();
})
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
      if (d.y < d.x) {
        d.red = true;
      }
    }
    // show the blue-or-red selector
    d3.select('#blue-or-red').style('display', 'block');
  }
  else {
    d3.select('#blue-or-red').style('display', 'none');
    // Remove decision boundary points when not in logistic mode with transition
    d3.selectAll('circle.decision-boundary-point')
      .transition()
      .duration(200)
      .attr('r', 0)
      .remove();
  }
  updateVis();
});

function addToBlue(p) {
  blueData.push(p);
}

function addToRed(p) {
  redData.push(p);
}

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

  let blueData = [];
  let redData = [];

  for (let dat of data) {
    if (dat.red) {
      redData.push(dat);
    } else {
      blueData.push(dat);
    }
  }
  
  // Get the width and height from the SVG and account for margins properly
  const margin = { top: 0, right: 0, bottom: 0, left: 0 };
  const width = +svg.attr('width') - margin.left - margin.right;
  const height = +svg.attr('height') - margin.top - margin.bottom;
  
  // Get or recreate the scales
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.x)])
    .range([0, width]);
    
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.y)])
    .range([height, 0]);

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
    const learning_rate = 0.2;
    weights[0] -= gradient[0] * learning_rate;
    weights[1] -= gradient[1] * learning_rate;
    weights[2] -= gradient[2] * learning_rate;
    
    // Create circles to see decision boundary
    for (let point of decisionBoundaryVisualPoints) {
        const normalized_input = weights[0] * normalizeX(point.x) + weights[1] * normalizeY(-point.y) + weights[2];
        const s = sigmoid(normalized_input);
        point.probability = s;
    }
      
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

function addPoint(x, y, red) {
  data.push({ x, y, red});
  console.log('addPoint data: ', data);
  updateVis();
}

const updateVis = () => {
  console.log("Updating visualization");
  console.log("Passing decisionBoundaryVisualPoints to scatterPlot:", decisionBoundaryVisualPoints);

  // refresh scatterPlot
  svg.call(scatterPlot, {
    data,
    addPoint,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
    // margin: { top: 50, bottom: 80, left: 150, right: 40 },
    circleRadius: 10,
    drawLine,
    param1,
    param2,
    redData,
    blueData,
    chosenAlgo,
    preserveGradient: true,
    decisionBoundaryVisualPoints,
    addToBlue,
    addToRed,
    blueOrRed
  });

  // Create matrix string from data points
  const xMatrix = data.map(point => `1 & ${point.x.toFixed(2)}`).join(' \\\\ ');
  const yVector = data.map(point => point.y.toFixed(2)).join(' \\\\ ');
  const matrixStr = data.length > 0
    ? `\\overset{\\text{xData}}{\\begin{bmatrix}${xMatrix}\\end{bmatrix}} \\overset{\\text{Parameters}}{\\begin{bmatrix}${param1} \\\\ ${param2}\\end{bmatrix}} = \\overset{\\text{yData (Trying to predict)}}{\\begin{bmatrix}${yVector}\\end{bmatrix}}`
    : 'empty-matrix';

  // refresh math using MathJax
  let formulaStr = '';
  if (chosenAlgo === "linear") {
    formulaStr = `\\text{Linear Regression Formula: } y = ${param1} + ${param2}x`;
  } else if (chosenAlgo === "logistic") {
    formulaStr = `\\text{Logistic Regression Formula: } P(y=1) = \\frac{1}{1 + e^{-(w_0 + w_1x + w_2y)}}`;
  }

  d3.select('#math').html(`
    <p>\\[${matrixStr}\\]</p>
    <p>\\[${formulaStr}\\]</p>`);

  // Safely handle MathJax rendering using Promise
  if (window.MathJax) {
    window.MathJax.typesetPromise && window.MathJax.typesetPromise()
      .catch(err => {
        console.warn('MathJax rendering failed:', err);
      });
  }
};

updateVis();
