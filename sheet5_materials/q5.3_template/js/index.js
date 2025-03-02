import { horizontalLinkTree }  from './horizontalLinkTree.js';

// Give our current document size to the svg
const svg = d3.select('svg')
    .attr('width',  +document.documentElement.clientWidth)
    .attr('height', +document.documentElement.clientHeight);

// Load data and visualise tree
d3.json('./data/data.json')
  .then(data => {

    // visualise tree
    svg.call(horizontalLinkTree, {
      data: data,
      margin: { top: 10, bottom: 10, left: 75, right: 90}
    });
  
  });

