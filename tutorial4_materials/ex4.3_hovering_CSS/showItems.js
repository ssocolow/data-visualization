export const showItems = (parent, props) => {
  // Unpack my properties
  const data = props;
  const height = +parent.attr('height');

  const circles = parent.selectAll('circle').data(data, d => d.id);
  const circlesEnter = circles.enter().append('circle')
    .attr('cx', (d,i) => (i * 100) + 80);
  circlesEnter.append('title')
    .text(d => `${d.type}\nPrice: £${d.price}`); 
  circlesEnter.merge(circles)
    .attr('cy', height/2)
    .attr('stroke-width', 5)
    .transition().duration(5)
      .attr('cx', (d,i) => (i * 100) + 80)
      .attr('r', d => d.price);
  circles.exit().remove();  
}
