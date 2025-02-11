export const showItems = (parent, props) => {
  // Unpack my properties
  const {data, selectedItem, setSelectedItem, unsetSelectedItem} = props;
  const height = +parent.attr('height');

  const circles = parent.selectAll('circle').data(data, d => d.id); 
  const circlesEnter = circles.enter().append('circle')
    .attr('cx', (d,i) => (i * 100) + 80);
  circlesEnter.merge(circles)
    .attr('cy', height/2)
    .attr('stroke-width', 5)
    .attr('stroke', d => d.id === selectedItem ? 'black' : 'none')
    .on('click', setSelectedItem)
    .transition().duration(500)
      .attr('cx', (d,i) => (i * 100) + 80)
      .attr('r', d => d.price);
  circles.exit().remove();  
}
  
