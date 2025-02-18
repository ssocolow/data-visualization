const svg = d3.select('svg');
const width  = +svg.attr('width');
const height = +svg.attr('height');

d3.csv('countries.csv').then(data => {     // Data loading
  data.forEach(d => {
    d.population = +d.population * 1000;   // Data parsing
  });
  render(data);                            // Data rendering (calls 'render')
});

const render = data => {
  const margin = { top: 20, bottom: 20, left: 100, right: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const g = svg                            // append a new group, for inner margins
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  const xValue = d => d.population;        // data accessors
  const yValue = d => d.country;           // (making rest of code easier to adapt)

  const xScale = d3.scaleLinear()          // scale to set bar widths
    .domain([0, d3.max(data, xValue)])
    .range([0, innerWidth]);
  
  const yScale = d3.scaleBand()            // scale to set bar heights 
    .domain(data.map(yValue))
    .range([0, innerHeight])
    .paddingInner(0.1);

  // Add our chart elements (bars)
  g
    .selectAll('rect')                     // select all existing rectangles (none)
    .data(data).enter()                    // create data join
    .append('rect')                        // append one rectangle per element
      .attr('class','bar')
      .attr('width', d => xScale(xValue(d)))
      .attr('height', yScale.bandwidth())
      .attr('y', d => yScale(yValue(d)));

  // Create axes
  g.append('g').call(d3.axisLeft(yScale));
  g.append('g').call(d3.axisBottom(xScale))
    .attr('transform', `translate(0,${innerHeight})`);
};