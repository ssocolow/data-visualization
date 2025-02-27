const svg = d3.select('svg');
const width  = +svg.attr('width');
const height = +svg.attr('height');
const margin = {top: 10, bottom: 30, left: 30, right: 10};

// Example data
const data = [
  { 'year': 2015, 'milk': 10, 'water': 4 },
  { 'year': 2016, 'milk': 12, 'water': 6 },
  { 'year': 2017, 'milk': 6,  'water': 7 }
];

/** - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Standard layout setup
 ** - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// Margin conventions
const innerWidth  = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Group element that will contain our actual chart
const chart = svg.append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);

// Axis scales
const xScale = d3.scaleBand()
  .domain([2015, 2016, 2017])
  .range([0, innerWidth])
  .paddingInner(0.2)
  .paddingOuter(0.2);

const yScale = d3.scaleLinear()
  .domain([0, 18])  
  .range([innerHeight, 0]);

// Initialise axes
const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale)
  .ticks(6);

// Append empty axis groups to the chart group
const xAxisG = chart.append('g')
  .attr('class', 'axis x-axis')
  .attr('transform', `translate(0,${innerHeight})`);

const yAxisG = chart.append('g')
  .attr('class', 'axis y-axis');

// Generate axes
xAxisG.call(xAxis);
yAxisG.call(yAxis);

/** - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Actual stacked bar chart generation
 ** - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
// 1. Initialise stack generator and specify the categories or layers
//    that we want to show in the chart
const stack = d3.stack().keys(['milk', 'water']);

// 2. Call stack generator on the dataset
const stackedData = stack(data);
console.log(stackedData);

// 3. Create our stacked bar chart
chart.selectAll('category').data(stackedData)
  .enter().append('g')
    .attr('class', d => `category cat-${d.key}`)
  .selectAll('rect').data(d => d)
    .enter().append('rect')
      .attr('x', d => xScale(d.data.year))
      .attr('y', d => yScale(d[1]))
      .attr('height', d => yScale(d[0]) - yScale(d[1]))
      .attr('width', xScale.bandwidth());


