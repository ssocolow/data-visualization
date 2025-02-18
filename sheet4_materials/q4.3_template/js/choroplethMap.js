// Define projection and pathGenerator
const projection = d3.geoNaturalEarth1()
const pathGenerator = d3.geoPath().projection(projection)

export const choroplethMap = (parent, props) => {
  const { 
    countries,
    colourValue,
    colourScale,
    doesInclude
  } = props;

  // Group for map elements
  // ...
  const mapGroup = parent.append('g');

  // zoom interactivity
  const zoom = d3.zoom()
  .scaleExtent([0.5, 10])
  .on('zoom', (event) => {
    mapGroup.attr('transform', event.transform)
  })
  mapGroup.call(zoom)

  // Earth's border
  mapGroup.append('path')
    .attr('class', 'sphere')
    .attr('d', pathGenerator({type: 'Sphere'}))

  // Paths for countries
  // ...
  const tooltipPadding = 15;
  mapGroup.selectAll('path')
    .data(countries.features)
    .enter()
    .append('path')
      .attr('class', 'country')
      .attr('d', d => pathGenerator(d))
      .attr('fill', d => colourScale(colourValue(d)))
      .on('mouseover', (event, d) => {
        if (doesInclude(d.properties.economy)) {
          d3.select('#tooltip')
          .style('display', 'block')
          .style('left', (event.pageX + tooltipPadding) + 'px')
          .style('top', (event.pageY + tooltipPadding) + 'px')
          .html(`
          <div class="tooltip-title">${d.properties.admin}</div>
          <div>${d.properties.economy}</div>
        `);
        }
      })
      .on('mouseleave', () => {
        d3.select('#tooltip').style('display', 'none');
      })

  // Tooltip event listeners
  // ...
}

