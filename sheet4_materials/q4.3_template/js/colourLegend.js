export const colourLegend = (parent, props) => {
  const { 
    colourScale, 
    circleRadius,
    spacing,
    textOffset
  } = props;

  // We're passing colourScale as part of props, and need its domain data
  const groups = parent.selectAll('g').data(colourScale.domain());
  const groupsEnter = groups
    .enter().append('g')
      .attr('class','legend')
      .attr('transform', (d, i) => `translate(0, ${i * spacing})`);

  groupsEnter.append('circle')
      .attr('fill', colourScale)
      .attr('r', circleRadius);

  groupsEnter.append('text')
      .text(d => d)
      .attr('x', textOffset);
}


