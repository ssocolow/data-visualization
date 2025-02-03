export const colourLegend = (parent, props) => {
  // unpack my props
  const { 
    colourScale, 
    circleRadius,
    spacing,
    textOffset
  } = props;

  const circles = parent.selectAll('circle')
  .data(colourScale.domain(), d => d);
const circlesEnter = circles.enter().append('circle')
  .attr('cy', (d,i) => (i * spacing) + 80)
  .attr('cx', 0)
  .attr('fill', d => colourScale(d))
  .attr('r', d => circleRadius);

const labels = parent.selectAll('text')
  .data(colourScale.domain(), d => d); 
const labelsEnter = labels.enter().append('text')
  .attr('x', textOffset)
  .attr('y', (d,i) => (i * spacing) + 85)
  .text(d => d) 

}
