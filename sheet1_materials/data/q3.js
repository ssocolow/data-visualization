const svg = d3.select('svg');
const width  = +svg.attr('width');
const height = +svg.attr('height');

d3.csv('auto-mpg.csv').then(data => {     // Data loading
  data.forEach((d) => {
    d.horsepower = +d.horsepower;   // Data parsing
    d.weight = +d.weight;   // Data parsing
  });
  render(data);                            // Data rendering (calls 'render')
});

const render = data => {
  const margin = { top: 20, bottom: 100, left: 100, right: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const g = svg                            // append a new group, for inner margins
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  const xValue = d => d.horsepower;        // data accessors
  const yValue = d => d.weight;           // (making rest of code easier to adapt)

  const xScale = d3.scaleLinear()          // scale to set bar widths
    .domain([d3.min(data, xValue), d3.max(data, xValue)])
    .range([0, innerWidth])
    .nice();
  
  const yScale = d3.scaleLinear()            // scale to set bar heights 
    .domain([d3.min(data, yValue), d3.max(data, yValue)])
    .range([0, innerHeight])
    .nice()


  // Add our chart elements (circles)
  g
    .selectAll('circle')                     // select all existing rectangles (none)
    .data(data).enter()                    // create data join
    .append('circle')                        // append one rectangle per element
      .attr('class','circle')
      .attr('cx', d => xScale(xValue(d)))
      .attr('cy', d => yScale(yValue(d)))
      .attr('r', 10)

  // Create axes
  g.append('g').call(d3.axisLeft(yScale))
  .selectAll('.tick line')
  .attr('x1',0)
  .attr('x2', innerWidth);
  // I will make a different x axis
  g.append('g').call(d3.axisBottom(xScale).tickSize(10))
    .attr('transform', `translate(0,${innerHeight})`)
    .selectAll('.tick line')
    .attr('y1',0)
    .attr('y2', -innerWidth)
    
  g.append("text")
    .text("Horsepower")
    .attr("class","axis-label")
    .attr('x', innerWidth / 2)
    .attr('y', innerHeight + 50);

  g.append("text")
    .attr("class", "ylabel")
    .attr("text-anchor", "end")
    .attr("y", -70)
    .attr("x", -innerHeight / 2)
    .attr("transform", "rotate(-90)")
    .text("Weight");

//   g.append("text")
//     .text("Weight")
//     .attr("class","axis-label-rotated")
//     .attr('x', -80)
//     .attr('y', innerHeight / 2);
g.selectAll('.tick text').attr('class', 'ticktext');
g.selectAll('.tick line').attr('class', 'tickline');
  
};

