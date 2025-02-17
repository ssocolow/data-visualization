export const choroplethMap = (parent, props) => {
  const { 
    countries,
    colourValue,
    colourScale
  } = props;
  

  const projection = d3.geoMercator()
    .fitSize([1000, 500], countries)
    
  // Test a sample coordinate
  const testPoint = countries.features[0].geometry.coordinates[0][0];
  console.log('Sample projection:', projection(testPoint));

  const pathGenerator = d3.geoPath().projection(projection)

  // Group for map elements
  const mapGroup = parent.append('g')

  // Zoom interactivity (using d3-zoom package -- standard d3 bundle)
  const zoom = d3.zoom()
  .scaleExtent([0.5, 10])
  .on('zoom', (event) => {
    mapGroup.attr('transform', event.transform)
  })
  mapGroup.call(zoom)
  
  // Append our paths for the countries
  // ...
  // console.log(data);
  // Convert TopoJSON to GeoJSON  
  console.log('Countries data:', countries);
  console.log('Features:', countries.features);

  const tooltipPadding = 15;
  // Render the map with error checking
  mapGroup.selectAll('path')
    .data(countries.features)
    .enter()
    .append('path')
      .attr('class', 'country')
      .attr('d', d => pathGenerator(d))
      .attr('fill', d => colourScale(colourValue(d)))
      .on('mouseover', (event, d) => {
        d3.select('#tooltip')
        .style('display', 'block')
        .style('left', (event.pageX + tooltipPadding) + 'px')
        .style('top', (event.pageY + tooltipPadding) + 'px')
        .html(`
          <div class="tooltip-title">${d.properties.admin}</div>
          <div><i>${d.properties.pop_density} pop. density per km^2</i></div>
        `);
      })
      .on('mouseleave', () => {
        d3.select('#tooltip').style('display', 'none');
      })
    // .append('title')
    //   .text(d => d.properties.name);


}

