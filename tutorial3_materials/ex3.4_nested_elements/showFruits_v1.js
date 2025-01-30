// Ordinal scale to map the basic colours into more pleasant tones
const colourScale = d3.scaleOrdinal()
  .domain(['red', 'yellow', 'green', 'blue'])
  .range(['#d12013', '#f1e423', '#19ce13', '#3838a1']);

export const showFruits = (parent, props) => {
  // Unpack my properties
  const {fruits, height} = props;

  const circles = parent.selectAll('circle')
    .data(fruits, d => d.type); 
  const circlesEnter = circles.enter().append('circle')
    .attr('cx', (d,i) => (i * 100) + 80);
  circlesEnter.merge(circles)
    .attr('cy', height/2)
    .transition().duration(1000)
      .attr('fill', d => colourScale(d.colour))
      .attr('cx', (d,i) => (i * 100) + 80)
      .attr('r', d => d.amount);
  circles.exit().remove();

  const labels = parent.selectAll('text')
    .data(fruits, d => d.type); 
  const labelsEnter = labels.enter().append('text')
    .attr('x', (d,i) => (i * 100) + 80)
    .attr('y', height/2 + 80);
  labelsEnter.merge(labels)
    .text(d => d.type)
    .transition().duration(1000)
      .attr('x', (d,i) => (i * 100) + 80);
  labels.exit().remove();
}
