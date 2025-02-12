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

  // add the invisible rectangle
  parent.append('rect')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('mousemove', (event, d) => {
      const pos = d3.pointer(event);
      const x = xScale.invert(pos[0]);
      const index = d3.bisectLeft(data.map(xValue), x);
      const closest = data[index];
      // console.log(yScale(yValue(closest)));
      chart.selectAll('circle').remove();

      chart.append('circle')
        .attr('cx', pos[0])
        .attr('cy', yScale(yValue(closest)))
        .attr('r', 4)
        .attr('fill', '#5cd237')

      d3.select('#tooltip')
        .style('display', 'block')
        .style('left', (pos[0] + margin.left) + 'px')   
        .style('top', (yScale(yValue(closest)) + margin.top - 30) + 'px')
        .html(`
          <div class="tooltip-title">${Math.round(yValue(data[index]))}</div>
        `);
    })
    .on('mouseleave', () => {
      d3.select('#tooltip').style('display', 'none');
      chart.selectAll('circle').remove();
    })
    .on('mouseenter', () => {
      d3.select('#tooltip').style('display', 'block');
    });

};
