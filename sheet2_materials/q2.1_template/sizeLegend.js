export const sizeLegend = (parent, props) => {
  // unpack my props
  const { 
    sizeScale, 
    numTicks,
    spacing,
    textOffset,
    circleFill
  } = props;

  const ticks = sizeScale.ticks(numTicks).reverse();
  // get rid of 0
  ticks.pop();
  // console.log(ticks);
  const circles = parent.selectAll('circle')
  .data(ticks, d => d);
const circlesEnter = circles.enter().append('circle')
  .attr('cy', (d,i) => (i * spacing) + 85)
  .attr('cx', 0)
  .attr('fill', circleFill)
  .attr('r', d => sizeScale(d));

const labels = parent.selectAll('text')
  .data(ticks, d => d); 
const labelsEnter = labels.enter().append('text')
  .attr('x', d => sizeScale(d) + textOffset)
  .attr('y', (d,i) => (i * spacing) + 90)
  .text(d => d)

}
