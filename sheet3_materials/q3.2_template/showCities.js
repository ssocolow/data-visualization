export const showCities = (parent, props) => {
  // unpack my props
  const {
    data,
    selectedOptions
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
  gEnter.merge(g)
    .selectAll('circle')
    .attr('opacity', selectedOptions.includes('cities') ? 1 : 0);

  gEnter.merge(g)
    .selectAll('text')
    .attr('opacity', d => selectedOptions.includes('labels') ? (d.population < 1000000 ? 0 : 1) : 0);

  // Remove elements when data is removed
  g.exit().remove();
};
