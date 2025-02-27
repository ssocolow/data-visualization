const svg = d3.select('svg');
const width  = +svg.attr('width');
const height = +svg.attr('height');
const margin = {top: 10, bottom: 30, left: 50, right: 10};

// Example data
const data = [
  { 'name': 'Bob',   'concept': 'food',    'amount':  400 },
  { 'name': 'Bob',   'concept': 'leisure', 'amount':  200 },
  { 'name': 'Bob',   'concept': 'bills',   'amount':  900 },
  { 'name': 'Alice', 'concept': 'food',    'amount':  300 },
  { 'name': 'Alice', 'concept': 'leisure', 'amount':  400 },
  { 'name': 'Alice', 'concept': 'bills',   'amount': 1300 },
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
  .domain(['Bob', 'Alice'])
  .range([0, innerWidth])
  .paddingInner(0.2)
  .paddingOuter(0.2);

const yScale = d3.scaleLinear()
  .domain([0, 2000])  
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
// 1. Group the data per person
const groupedData = d3.groups(data, d => d.name);
console.log(groupedData);

// 2. Initialise stack generator
const stack = d3.stack()
  .keys([0,1,2])
  .value((d,key) => d[1][key].amount);

// 3. Produce the stacked data
const stackedData = stack(groupedData);
console.log(stackedData);

// 4. Create our stacked bar chart
chart.selectAll('category').data(stackedData)
  .enter().append('g')
    .attr('class', d => `category cat-${d.key}`)
  .selectAll('rect').data(d => d)
    .enter().append('rect')
      .attr('x', d => xScale(d.data[0]))
      .attr('y', d => yScale(d[1]))
      .attr('height', d => yScale(d[0]) - yScale(d[1]))
      .attr('width', xScale.bandwidth());


