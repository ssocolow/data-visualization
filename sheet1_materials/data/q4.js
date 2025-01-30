const svg = d3.select('svg');
const width  = +svg.attr('width');
const height = +svg.attr('height');

d3.csv('sp-500-index.csv').then(data => {     // Data loading
  data.forEach((d) => {
    d.date = new Date(d.date);   // Data parsing
    d.close = +d.close;   // Data parsing
  });
  console.log(data)
  render(data);                            // Data rendering (calls 'render')
});

const render = data => {
  const margin = { top: 20, bottom: 100, left: 100, right: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const g = svg                            // append a new group, for inner margins
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  const xValue = d => d.date;        // data accessors
  const yValue = d => d.close;           // (making rest of code easier to adapt)

  const xScale = d3.scaleTime()          // scale to set bar widths
    .domain([d3.min(data, xValue), d3.max(data, xValue)])
    .range([0, innerWidth])
  
  const yScale = d3.scaleLinear()            // scale to set bar heights 
    .domain([d3.max(data, yValue), d3.min(data, yValue)])
    .range([0, innerHeight])

// Define the area generator
const area = d3.area()
  .x(d => xScale(xValue(d)))  // X scale function for the data points
  .y0(yScale(1864.780029))        // Y scale for the baseline (bottom of the area)
  .y1(d => yScale(yValue(d))); // Y scale for the data points (top of the area)

  const lineGenerator = d3.line()
    .x(d => xScale(xValue(d)))
    .y(d => yScale(yValue(d)));

  g.append('path')
      .data([data])
      .attr('class','area')
      .attr("d", area)
      // .attr('stroke', 'blue')  // Change the stroke color to blue or any other color
      .attr('stroke-width', 2)
      .attr('fill','aliceblue')
  
  g.append('path')
    .attr('d',lineGenerator(data))
    .attr('class','chart-line')
    // .attr("d", area)
    // .attr('stroke', 'blue')  // Change the stroke color to blue or any other color
    // .attr('stroke-width', 2)
    // .attr('fill','aliceblue')

  // Create axes
  g.append('g').call(d3.axisLeft(yScale))

  // I will make a different x axis
  g.append('g').call(d3.axisBottom(xScale).tickSize(10))
    .attr('transform', `translate(0,${innerHeight})`)
//   g.append("text")
//     .text("Weight")
//     .attr("class","axis-label-rotated")
//     .attr('x', -80)
//     .attr('y', innerHeight / 2);
g.selectAll('.tick text').attr('class', 'ticktext');
g.selectAll('.tick line').attr('class', 'tickline');
  
};

