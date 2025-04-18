export const barchart = (parent, props) => {
  // unpack my props
  const {
    data,
    margin,
    xValue, 
    xTickLabels,
    yValue, 
    yAxisLabel,
    colourScale,
    colourValue,
    changeSelectedDifficulty,
    getSelectedDifficulty
  } = props;

  const width = +parent.attr('width');
  const height = +parent.attr('height');
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Chart taking care of inner margins
  const chart = parent.selectAll('.barchart').data([null]);
  const chartEnter = chart
    .enter().append('g')
      .attr('class','barchart')
      .attr('transform', `translate(${margin.left},${margin.top})`);

  // Initialise scales
  const xScale = d3.scaleBand()
    .domain(data.map(xValue))
    .range([0, innerWidth])
    .paddingInner(0.2);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, yValue)])
    .range([innerHeight, 0]);

  // Initialise axes
  const xAxis = d3.axisBottom(xScale)
    .ticks(xTickLabels)
    .tickSizeOuter(0)
    .tickPadding(10);
    
  const yAxis = d3.axisLeft(yScale)
    .ticks(6)
    .tickSizeOuter(0)
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

  // Append y-axis title
  yAxisG
    .append('text')
      .attr('class', 'axis-title')
      .attr('x', 25)
      .attr('y', -25)
      .text(yAxisLabel);
    
  // Plot data
  const bars = chartEnter.merge(chart)
    .selectAll('.bar').data(data);
  
  // Enter new bars
  const barsEnter = bars
    .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(xValue(d)))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(yValue(d)))
      .attr('y', d => yScale(yValue(d)))
      .attr('fill', d => colourScale(colourValue(d)));

  // Update both existing and new bars
  bars.merge(barsEnter)
    .on('click', (event, d) => {
      if (getSelectedDifficulty().includes(d.level)) {  
        changeSelectedDifficulty(getSelectedDifficulty().filter(n => n !== d.level));
      } else {
        changeSelectedDifficulty([...getSelectedDifficulty(), d.level]);
      }
    })
    .attr('opacity', d => getSelectedDifficulty().includes(d.level) ? 1 : 0.2);
};

