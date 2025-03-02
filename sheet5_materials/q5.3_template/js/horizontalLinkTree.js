export const horizontalLinkTree = (parent, props) => {
  // unpack my props
  const {
    data,
    margin
  } = props;

  // Standard margin conventions
  const width  = +parent.attr('width');
  const height = +parent.attr('height');
  const innerWidth  = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Chart taking care of inner margins
  const chart = parent
    .append('g')
      .attr('class','chart')
      .attr('transform', `translate(${margin.left},${margin.top})`);

  // Implement tree chart
  const treeData = d3.hierarchy(data);

  console.log(treeData);
  const treeLayout = d3.tree()
    .size([innerHeight, innerWidth]);
  const links = treeLayout(treeData).links();
  const linkPathGenerator = d3.linkHorizontal()
    .x(d => d.y)
    .y(d => d.x);
  
  chart.selectAll('.link').data(links)
    .join('path')
    .attr('class', 'link')
    .attr('d', linkPathGenerator);
  
  const nodesG = chart.selectAll('.node-group').data(treeData.descendants())
    .join('g')
    .attr('transform', d => `translate(${d.y},${d.x})`);

  nodesG.append('text')
    .attr('class', 'label')
    .attr('x', d => d.children ? 0 : 1)
    .attr('font-size', d => 5 + (10 * d.height))
    .attr('text-anchor', d => d.children ? 'middle' : 'start')
    .text(d => {
      // console.log(d);
      return d.data.data.id;
    });
      
  // Zoom interactivity (using d3-zoom package -- standard d3 bundle)
  const zoom = d3.zoom()
    .scaleExtent([0.5, 10])
    .on('zoom', (event) => {
      if (event.transform.k === 0.5) {
        parent.transition()
          .duration(750)
          .call(zoom.transform, d3.zoomIdentity.translate(0, 0));
      } else {
        chart.attr('transform', `translate(${event.transform.x + margin.left},${event.transform.y + margin.top}) scale(${event.transform.k})`);
      }
    });

  parent.call(zoom);  // Apply zoom to the parent SVG, not the chart group

};
