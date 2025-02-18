export const colourLegend = (parent, props) => {
  const { 
    colourScale, 
    circleRadius,
    spacing,
    textOffset,
    selectedEconomy,
    onEconomySelect
  } = props;

  let clicked = 0;
  // We're passing colourScale as part of props, and need its domain data
  const domain = colourScale.domain();
  console.log(domain);
  // Add debug logging to see all elements including empty ones
  // domain.unshift(null);
  // domain.forEach((d, i) => {
  //   console.log(`Domain element ${i}:`, d, `(${typeof d})`);
  // });

  // Create a container group for the legend
  const legendContainer = parent.append('g')
    .attr('class', 'legend-container')
    .attr('transform', 'translate(20, 280)'); // Adjust position as needed

  // Add white background with rounded corners
  legendContainer.append('rect')
    .attr('class', 'legend-background')
    .attr('width', 250)  // Adjust width as needed
    .attr('height', domain.length * spacing + 20)  // Height based on number of items
    .attr('rx', 10)  // Rounded corners
    .attr('ry', 10)
    .attr('fill', 'white')
    .attr('stroke', '#ccc')
    .attr('opacity', 0.7)
    .attr('stroke-width', 1);

  const groups = legendContainer.selectAll('g.legend-item')
    .data(domain);

  const groupsEnter = groups
    .enter().append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(20, ${20 + i * spacing})`)
      .on('click', (event, d) => {
        if (clicked === 0) {
          // Update selected economy through callback instead of direct assignment
          onEconomySelect([d]);
          
          // Set all groups to low opacity
          legendContainer.selectAll('g.legend-item')
          .style('opacity', 0.2);

          // Set clicked group back to full opacity  
          d3.select(event.currentTarget)
          .style('opacity', 1);

          d3.selectAll('.country')
            .style('opacity', countryD => 
              countryD.properties.economy === d ? 1 : 0.2
            );
          clicked = 1;
        } else {
          // Update with all economies through callback
          onEconomySelect(['1. Developed region: G7', '2. Developed region: nonG7', 
            '3. Emerging region: BRIC', '4. Emerging region: MIKT', 
            '5. Emerging region: G20', '6. Developing region', '7. Least developed region']);
          
          // Set all groups to low opacity
          legendContainer.selectAll('g.legend-item')
          .style('opacity', 1);
        
          d3.selectAll('.country')
            .style('opacity', 1);
          clicked = 0;
        }
      })

  groupsEnter.append('circle')
      .attr('fill', colourScale)
      .attr('r', circleRadius);

  groupsEnter.append('text')
      .text(d => d)
      .attr('x', textOffset)
      .attr('y', 5);
}