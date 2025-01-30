const svg = d3.select('svg');
const width  = +svg.attr('width');
const height = +svg.attr('height');

// Call rendering function with 2 datasets sequentially
// the second with a delay of 1 second since loading the web
drawCircles(svg, [5, 10, 15]);
setTimeout(() => {              // Implement delay
  drawCircles(svg, [20, 25]);
}, 1000);

function drawCircles(parent, data) {
  // Data-join (circles now contains the update selection)
  const circles = parent.selectAll('circle')
    .data(data);

  // Enter (initialise the newly added elements)
  const circlesEnter = circles.enter().append('circle');

  // Enter and Update (set the dynamic properties of the elements)
  circlesEnter.merge(circles)
    .attr('cx', (d,i) => (i * 80) + 50)
    .attr('cy', height/2)
    .attr('r', d => d);

  // Exit
  circles.exit().remove();
}
