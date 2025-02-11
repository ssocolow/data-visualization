export const areaChart = (parent, props) => {
  // unpack my props
  const {
    data,
    margin,
    xValue, 
    yValue, 
    title
  } = props;

  const width = +parent.attr('width');
  const height = +parent.attr('height');
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Chart group taking care of inner margins
  const chart = parent.append('g')
      .attr('class','chart')
      .attr('transform', `translate(${margin.left},${margin.top})`);

  // Initialise scales
  const xScale = d3.scaleTime()
    .domain(d3.extent(data, xValue))
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, yValue))
    .range([innerHeight, 0])
    .nice();

  // Initialise axes
  const xAxis = d3.axisBottom(xScale)
    .tickPadding(10);

  const yAxis = d3.axisLeft(yScale)
    .tickPadding(10);

  // Append empty x-axis group and move it to the bottom of the chart
  const xAxisG = chart.append('g')
    .attr('class','axis x-axis')
    .attr('transform', `translate(0,${innerHeight})`);
  xAxisG.call(xAxis);

  // Append y-axis group
  const yAxisG = chart.append('g')
    .attr('class','axis y-axis');
  yAxisG.call(yAxis).select('.domain').remove();

  // title
  chart.append('text')
    .attr('class', 'title')
    .attr('y',-30)
    .text(title);

  // Plot data
  const lineGenerator = d3.line()
    .x(d => xScale(xValue(d)))
    .y(d => yScale(yValue(d)));

  const areaGenerator = d3.area()
    .x(d => xScale(xValue(d)))
    .y0(innerHeight)
    .y1(d => yScale(yValue(d)));

  chart.append('path')
    .attr('class','chart-area')
    .attr('d', areaGenerator(data));

  chart.append('path')
    .attr('class','chart-line')
    .attr('d', lineGenerator(data));

};
