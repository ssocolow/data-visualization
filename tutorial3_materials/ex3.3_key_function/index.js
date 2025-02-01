const svg = d3.select('svg');
const width  = +svg.attr('width');
const height = +svg.attr('height');

// Call rendering function with 2 datasets sequentially
// the second with a delay of 1 second since loading the web
drawCircles(svg, [5, 10, 15]);
setTimeout(() => {
  drawCircles(svg, [10, 15]);
}, 1000);

setTimeout(() => {
  drawCircles(svg, [15]);
}, 2000);
setTimeout(() => {
  drawCircles(svg, [30, 30, 20, 10]);
}, 3000);
setTimeout(() => {
  drawCircles(svg, [30, 20]);
}, 4000);
setTimeout(() => {
  drawCircles(svg, [25, 25]);
}, 5000);


function drawCircles(parent, data) {
  // Data-join (circles now contains the update selection)
  const circles = parent.selectAll('circle')
    .data(data, d => d); // could be also d => d.customer_id if d is an object

  // Enter (initialise the newly added elements)
  const circlesEnter = circles.enter().append('circle')
    .attr('cx', (d,i) => (i * 80) + 50);

  // Enter and Update (set the dynamic properties of the elements)
  circlesEnter.merge(circles)
    .attr('cy', height/2)
    .transition().duration(500)
      .attr('cx', (d,i) => (i * 80) + 50)
      .attr('r', d => d);
  console.log('hi')
  // Exit
  circles.exit()
    .transition().duration(500)
      .attr('r', 0)
    .remove();
}
