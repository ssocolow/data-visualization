const svg = d3.select('svg');
const width  = +svg.attr('width');
const height = +svg.attr('height');
const margin = {top: 10, bottom: 10, left: 100, bottom: 10, right: 100};

const data = {
  name: "root",
  children: [
    {name: "child #1"},
    {
      name: "child #2",
      children: [
        {name: "grandchild #1"},
        {name: "grandchild #2"},
        {name: "grandchild #3"}
      ]
    }
  ]
};

// Margin conventions
const innerWidth  = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Group element that will contain our actual chart
const chart = svg.append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);

// Create tree abstract data representation
const treeData = d3.hierarchy(data);

// Tree layout
const treeLayout = d3.tree().size([innerHeight, innerWidth]);

// Create links and their associated path generator
const links = treeLayout(treeData).links();
const linkPathGenerator = d3.linkHorizontal()
    .x(d => d.y)
    .y(d => d.x); 

// Create one path per link
chart.selectAll('.edge').data(links)
  .join('path')
    .attr('class', 'edge')
    .attr('d', linkPathGenerator);

// Draw the nodes
const nodesG = chart.selectAll('.node-group').data(treeData.descendants())
  .join('g')
    .attr('class', 'node-group')
    .attr('transform', d => `translate(${d.y},${d.x})`);

nodesG.append('circle')
    .attr('class', 'node-circle')
    .attr('r', 4);

nodesG.append('text')
    .attr('class', 'node-label')
    .attr('x', d => d.children ? 0 : 10)
    .attr('y', d => d.children ? -15 : 0)
    .attr('text-anchor', d => d.children ? 'middle' : 'start')
    .text(d => d.data.name);

