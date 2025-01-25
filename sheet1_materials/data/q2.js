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
  d3.select('h1')
    .text(`Top ${data.length} Most Populous Countries`);
  
  const margin = { top: 20, bottom: 50, left: 100, right: 40 };
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
  g.append('g').call(d3.axisLeft(yScale))
    .selectAll('.tick line')
    .remove();  // Remove the tick lines

  // I will make a different x axis
  // g.append('g').call(d3.axisBottom(xScale))
  //   .attr('transform', `translate(0,${innerHeight})`);
 
  const xAxisTickFormat = number => // Our own function for x-axis labels
    d3.format('.3s')(number)
    .replace('G','B')
    .replace('0.00','0');
 
  const xAxis = d3.axisBottom(xScale)
    .tickFormat(xAxisTickFormat)
    .tickSize(innerHeight)

  // make the x-axis group
  const xAxisG = g.append('g')
    .call(xAxis);
  
  xAxisG.append('text')
    .attr("class","axis-label")
    .attr('x', innerWidth / 2)
    .attr('y', innerHeight + 40)
    .attr('fill', "grey")
    .text("Population");
  
  xAxisG.selectAll('.tick text').attr('class', 'ticktext');
  xAxisG.selectAll('.tick line').attr('class', 'tickline');
  
};

