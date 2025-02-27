export const scatterplot = (parent, props) => {
  // unpack my props
  const {
    data,
    margin,
    xValue, 
    xAxisLabel,
    yValue, 
    yAxisLabel,
    colourScale,
    colourValue,
    symbolSize
  } = props;

  const width = +parent.attr('width');
  const height = +parent.attr('height');
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Chart taking care of inner margins
  const chart = parent.selectAll('.scatterplot').data([null]);
  const chartEnter = chart
    .enter().append('g')
      .attr('class','scatterplot')
      .attr('transform', `translate(${margin.left},${margin.top})`);

  // Initialise scales
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, xValue)])
    .range([0, innerWidth])
    .nice();

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, yValue)])
    .range([innerHeight, 0])
    .nice();

  // Initialise axes
  const xAxis = d3.axisBottom(xScale)
    .ticks(5)
    .tickSize(-innerHeight-10)
    .tickPadding(10)
    .tickFormat( d => d + ' km');
    
  const yAxis = d3.axisLeft(yScale)
    .ticks(4)
    .tickSize(-innerWidth-10)
    .tickPadding(10);

  // Append empty x-axis group and move it to the bottom of the chart
  const xAxisG = chartEnter
    .append('g')
      .attr('class','axis x-axis')
      .attr('transform', `translate(0,${innerHeight})`);
  xAxisG.call(xAxis);

  // Append y-axis group
  const yAxisG = chartEnter
    .append('g')
      .attr('class','axis y-axis');
  yAxisG.call(yAxis);

  // Append both axis titles
  xAxisG
    .append('text')
      .attr('class', 'axis-title')
      .attr('x', innerWidth+20)
      .attr('y', 45)
      .attr('text-anchor', 'end')
      .text(xAxisLabel);
    
  yAxisG
    .append('text')
      .attr('class', 'axis-title')
      .attr('x', 25)
      .attr('y', -25)
      .text(yAxisLabel);
    
  // Plot data
  const points = chartEnter.merge(chart)
    .selectAll('.point').data(data);
  const pointsEnter = points
    .enter().append('circle')
      .attr('class', 'point')
      .attr('cx', d => xScale(xValue(d)))
      .attr('cy', d => yScale(yValue(d)))
      .attr('fill', d => colourScale(colourValue(d)))
      .attr('r', symbolSize)
      .attr('stroke-width', 2);

  // Tooltip event listeners
  const tooltipPadding = 15;
  pointsEnter
    .on('mouseover', (event, d) => {
      d3.select('#tooltip')
        .style('display', 'block')
        .style('left', (event.pageX + tooltipPadding) + 'px')   
        .style('top', (event.pageY + tooltipPadding) + 'px')
        .html(`
          <div class="tooltip-title">${d.trail}</div>
          <div><i>${d.region}</i></div>
          <ul>
            <li>${d.distance} km, ~${d.time} hours</li>
            <li>${d.difficulty}</li>
            <li>${d.season}</li>
          </ul>
        `);
    })
    .on('mouseleave', () => {
      d3.select('#tooltip').style('display', 'none');
    });
};

