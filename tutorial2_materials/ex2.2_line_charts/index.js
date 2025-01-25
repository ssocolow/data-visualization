const data = [{x: 0, y: 10}, {x: 100, y: 75}, {x: 300, y: 90}, {x: 350, y: 20}];

// Please comment/uncomment each respective section

// ---------------------------------------------------------------
// Section 1: Basic line chart
// ---------------------------------------------------------------
// Prepare a helper function
// const line = d3.line()
//   .x(d => d.x)
//   .y(d => d.y);

// // Add the <path> to the <svg> container using the helper function
// d3.select('svg').append('path')
//   .attr('d', line(data))
//   .attr('stroke', 'red')
//   .attr('fill', 'none');


// ---------------------------------------------------------------
// Section 2: Basic area chart
// ---------------------------------------------------------------
// Prepare a helper function
// const area = d3.area()
//   .x(d => d.x)      // Same x-position
//   .y1(d => d.y)     // Top line y-position
//   .y0(0);           // Bottom line y-position

// // Add the <path> to the <svg> container using the helper function
// d3.select('svg').append('path')
//   .attr('d', area(data))
//   .attr('stroke', 'green')
//   .attr('fill', 'green');



// ---------------------------------------------------------------
// Section 3: Basic area chart with interpolation
// ---------------------------------------------------------------
// Prepare a helper function
const area = d3.area()
  .x(d => d.x)
  .y1(d => d.y)
  .y0(150)
  .curve(d3.curveNatural);

// Add the <path> to the <svg> container using the helper function
d3.select('svg').append('path')
  .attr('d', area(data))
  .attr('stroke', 'green')
  .attr('fill', 'green');



// ---------------------------------------------------------------
// Section 4: Basic line chart with interpolation
// ---------------------------------------------------------------
// Prepare a helper function
const line = d3.line()
  .x(d => d.x)
  .y(d => d.y)
  .curve(d3.curveStep);

// Add the <path> to the <svg> container using the helper function
d3.select('svg').append('path')
  .attr('d', line(data))
  .attr('stroke', 'red')
  .attr('fill', 'none');

