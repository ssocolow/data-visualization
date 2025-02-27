const svg = d3.select('svg');

d3.json('miserables.json').then(data => {
  // Group element that will contain our actual chart
  const chart = svg.append('g');

  // Initialise force simulation
  const simulation = d3.forceSimulation()
    .force('link',   d3.forceLink().id(d => d.id))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(+svg.attr('width')/2, +svg.attr('height')/2));

  // Add node-link data to the simulation
  simulation.nodes(data.nodes);
  simulation.force('link').links(data.links);

  // Colour scale
  const colorScale = d3.scaleOrdinal(d3.schemePaired)
    .domain(data.nodes.map(d => d.group));

  // Append links
  const links = chart.selectAll('line').data(data.links)
      .join('line');

  // Append nodes
  const nodes = chart.selectAll('circle').data(data.nodes)
      .join('circle')
        .attr('r', 5)
        .attr('fill', d => colorScale(d.group)); 

  // Update positions
  simulation.on('tick', () => {
    links
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
    nodes
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
  });

/*
  // Append links
  const links = chart.selectAll('line').data(data.links);
  const linksEnter = links
      .enter().append('line');

  // Append nodes
  const nodes = chart.selectAll('circle').data(data.nodes);
  const nodesEnter = nodes
      .enter().append('circle')
        .attr('r', 5)
        .attr('fill', d => colorScale(d.group));

  // Update positions
  simulation.on('tick', () => {
    linksEnter.merge(links)
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
    nodesEnter.merge(nodes)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
  });
*/
})
.catch(error => console.error(error));

