export const scatterPlot = (parent, props) => {
  // unpack my props
  const {
    data,
    margin,
    xValue, 
    xAxisLabel,
    yValue, 
    yAxisLabel,
    circleRadius
  } = props;

  // Add your implementation here
  // ...
  const svg = d3.select('svg');
  const width  = +svg.attr('width');
  const height = +svg.attr('height');
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Select and manage the main group
  const g = parent.selectAll('.plot-group').data([null]);
  const gEnter = g.enter()
    .append('g')
    .attr('class', 'plot-group')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Merge the enter and existing groups
  const gMerge = gEnter.merge(g);

  // Remove any extra groups
  // g.exit().remove();

  // x-axis
  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, xValue))
    .range([0, innerWidth])
    .nice();

  const xAxis = d3.axisBottom(xScale)
    .tickSize(-innerHeight)
    .tickPadding(15);                   // separation of tick labels from axis
  
  // Update x-axis
  const xAxisG = gMerge.selectAll('.x-axis').data([null]);
  const xAxisGEnter = xAxisG.enter()
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${innerHeight})`);

  xAxisG.merge(xAxisGEnter)
    .call(xAxis)
    .select('.domain').remove();

  // Update x-axis label
  const xAxisLabelG = gMerge.selectAll('.x-axis-label').data([null]);
  xAxisLabelG.enter()
    .append('text')
    .attr('class', 'x-axis-label')
    .merge(xAxisLabelG)
    .attr('x', innerWidth/2)
    .attr('y', innerHeight + 70)
    .attr('fill', 'black')
    .attr('text-anchor', 'middle')
    .text(xAxisLabel);

  // y-axis
  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, yValue))
    .range([0, innerHeight])
    .nice();

  const yAxis = d3.axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickPadding(10);

  // Update y-axis
  const yAxisG = gMerge.selectAll('.y-axis').data([null]);
  const yAxisGEnter = yAxisG.enter()
    .append('g')
    .attr('class', 'y-axis');

  yAxisG.merge(yAxisGEnter)
    .call(yAxis)
    .select('.domain').remove();

  // Update y-axis label
  const yAxisLabelG = gMerge.selectAll('.y-axis-label').data([null]);
  yAxisLabelG.enter()
    .append('text')
    .attr('class', 'y-axis-label')
    .merge(yAxisLabelG)
    .attr('x', -innerHeight/2)
    .attr('y', -100)
    .attr('fill', 'black')
    .attr('transform', `rotate(-90)`)
    .attr('text-anchor', 'middle')
    .text(yAxisLabel);
  
  // Update the circles
  const circles = gMerge.selectAll('circle').data(data);
  
  // Enter selection - append new circles
  const circlesEnter = circles.enter()
    .append('circle')
    .attr('cx', innerWidth / 2)  // start from center x
    .attr('cy', innerHeight / 2) // start from center y
    .attr('r', circleRadius);
    
  // Merge enter + update selections and transition their positions
  circles.merge(circlesEnter)
    .transition()
    .duration(1000)
    .delay((d,i) => i*5)
    .attr('cx', d => xScale(xValue(d)))
    .attr('cy', d => yScale(yValue(d)));
    
  // Exit selection - remove circles that are no longer needed
  // circles.exit().remove();

  // // add the data points to the chart
  // data.forEach(d => {
  //   // Plot data
  //   g.selectAll('circle')                 // select all existing circles (none)
  //   .data(data).enter()                 // create data join
  //   .append('circle')                   // append one circle per element
  //     .attr('cx', d => xScale(xValue(d)))
  //     .attr('cy', d => yScale(yValue(d)))
  //     .attr('r', circleRadius);
  // });
};