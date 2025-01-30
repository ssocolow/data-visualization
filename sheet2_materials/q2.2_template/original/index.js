const svg = d3.select('svg');
const width  = +svg.attr('width');
const height = +svg.attr('height');

d3.csv('auto-mpg.csv')
  .then(data => {     // Data loading
    data.forEach(d => {
      d.mpg = +d.mpg;                       // Data parsing
      d.cylinders = +d.cylinders;
      d.displacement = +d.displacement;
      d.horsepower = +d.horsepower;
      d.weight = +d.weight
      d.acceleration = +d.acceleration;
      d.year = +d.year;
    });
    render(data);                            // Data rendering (calls 'render')
  })
  .catch(error => {
    console.error('Error loading the data');
  });

// Creates one rectangle per entry (with appropriate width/height)
const render = data => {
  const xValue = d => d.horsepower;     // data accessors
  const xAxisLabel = 'Horsepower';

  const yValue = d => d.weight;         // (making rest of code easier to adapt)
  const yAxisLabel = 'Weight';

  const title = 'Cars: Horsepower vs Weight'

  const margin = { top: 50, bottom: 80, left: 150, right: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const circleRadius = 10;

  // append a new group, for inner margins
  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // x-axis
  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, xValue))
    .range([0, innerWidth])
    .nice();

  const xAxis = d3.axisBottom(xScale)
    .tickSize(-innerHeight)
    .tickPadding(15);                   // separation of tick labels from axis

  const xAxisG = g.append('g').call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`);

  xAxisG.select('.domain').remove();
  xAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('x', innerWidth/2)
    .attr('y', 70)
    .attr('fill', 'black')
    .text(xAxisLabel);

  // y-axis
  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, yValue))
    .range([0, innerHeight])
    .nice();

  const yAxis = d3.axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickPadding(10);                   // separation of tick labels from axis

  const yAxisG = g.append('g').call(yAxis);

  yAxisG.select('.domain').remove();
  yAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('x', -innerHeight/2)
    .attr('y', -100)
    .attr('fill', 'black')
    .attr('transform', `rotate(-90)`)
    .attr('text-anchor', 'middle')
    .text(yAxisLabel);

  // title
  g.append('text')
    .attr('class', 'title')
    .attr('x', innerWidth/2)
    .attr('y',-15)
    .text(title);

  // Plot data
  g.selectAll('circle')                 // select all existing circles (none)
    .data(data).enter()                 // create data join
    .append('circle')                   // append one circle per element
      .attr('cx', d => xScale(xValue(d)))
      .attr('cy', d => yScale(yValue(d)))
      .attr('r', circleRadius);
};