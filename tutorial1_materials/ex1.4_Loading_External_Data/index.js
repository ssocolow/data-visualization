d3.csv('menu.csv')
  .then(data => {                       // data loading
    data.forEach(d => {
      d.prize = +d.prize;               // data parsing
    });
    render(data);                       // data rendering (calls 'render')
  })
  .catch(error => {
    console.error('Error loading the data');
  });

const render = data => {
  d3.select('svg')
    .selectAll('circle')                // select all existing circles (none)
    .data(data).enter()                 // create data join
    .append('circle')                   // append one circle per element
      .attr('cx', (d,i) => 25 + i*60)
      .attr('cy', 25)
      .attr('r', d => (d.prize < 10) ? 15 : 25)
      .attr('fill', d => (d.vegetarian == 'yes') ? 'green' : 'yellow');
};
