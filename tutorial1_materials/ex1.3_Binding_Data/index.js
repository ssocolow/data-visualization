const radii = [15, 25, 25, 10, 15];

d3.select('svg')
  .selectAll('circle')
  .data(radii)
  .enter()
  .append('circle')
    .attr('cx', (d,i) => 25 + i*60)
    .attr('cy', 25)
    .attr('r', d => d)
    .attr('fill','red');

