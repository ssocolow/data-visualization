export const showCities = (parent, props) => {
  // unpack my props
  const {
    data
  } = props;

  // Groups to have together city marks and their labels
  const g = parent.selectAll('g').data(data);
  const gEnter = g
    .enter().append('g')
      .attr('transform', d => `translate(${d.x},${d.y})`);

  // Append circles to groups
  gEnter.append('circle')
      .attr('stroke-width', 2)
      .attr('r', d => (d.population < 1000000) ? 4 : 8);
  
  // Append labels to groups
  gEnter.append('text')
      .attr('class', 'city-label')
      .attr('y', -15)
      .text(d => d.city)
      .attr('opacity', d => (d.population < 1000000) ? 0 : 1);

  // Handle possible changes in circles and labels (opacity)
  // Use: gEnter.merge(g)...
  
};
