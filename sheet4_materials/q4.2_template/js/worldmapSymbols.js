export const worldmapSymbols = (parent, props) => {
  const { 
    countries,
    symbolsData
  } = props;

  // Define projection and pathGenerator
  const projection = d3.geoEqualEarth();
  const pathGenerator = d3.geoPath().projection(projection);

  // Group for map elements
  const mapGroup = parent.append('g')

  // Zoom interactivity (using d3-zoom package -- standard d3 bundle)
  const zoom = d3.zoom()
  .scaleExtent([0.5, 10])
  .on('zoom', (event) => {
    mapGroup.attr('transform', event.transform)
  })

  mapGroup.call(zoom)

  // Earth's border
  // ...
  mapGroup.append('path')
    .attr('class', 'sphere')
    .attr('d', pathGenerator({type: 'Sphere'}));

  // Map graticule
  // ...
  const graticule = d3.geoGraticule()();

  console.log(graticule);
  mapGroup.append('path')
    .attr('class', 'graticule')
    .attr('d', pathGenerator(graticule));


  // Paths for countries
  // Render the map by using the path generator
  mapGroup.selectAll('country').data(countries.features)
    .enter().append('path')
      .attr('class','country')
      .attr('d', pathGenerator)
  .append('title')
    .text(d => d.properties.name);

  // Seven Wonders
  // ...
  mapGroup.selectAll('circle').data(symbolsData)
    .enter().append('circle')
      .attr('class', 'wonder')
      .transition().duration(1000)
      .attr('cx', d => projection([d.lon, d.lat])[0])
      .attr('cy', d => projection([d.lon, d.lat])[1])
      .attr('r', 0)
      .transition().delay((d, i) => i * 600)
      .duration(1000)
      .attr('r', d => 1 + (4 * d.visitors ** 0.5))
  
  mapGroup.selectAll('text').data(symbolsData)
    .enter().append('text')
      .attr('class', 'wonder-title')
      .attr('x', d => projection([d.lon, d.lat])[0])
      .attr('y', d => projection([d.lon, d.lat])[1] - (4 + 8 * d.visitors ** 0.5))
      .attr('text-anchor', 'middle')
      .text(d => d.name);
  // Tooltip event listeners
  // ...
  const tooltipPadding = 15;
  mapGroup.selectAll('circle')
    .on('mouseover', (event, d) => {
      d3.select('#tooltip')
        .style('display', 'block')
        .style('left', (event.pageX + tooltipPadding) + 'px')   
        .style('top', (event.pageY + tooltipPadding) + 'px')
        .html(`
          <div class="tooltip-title">${d.name}</div>
          <div>${d.country} | ${d.visitors}M visitors</div>
        `);
    })
    .on('mouseleave', () => {
      d3.select('#tooltip').style('display', 'none');
    });
}
