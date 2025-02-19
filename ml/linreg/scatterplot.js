// Store zoom state outside the component
let currentZoomTransform = d3.zoomIdentity;

export const scatterPlot = (parent, props) => {
  // unpack my props
  const {
    data,
    addPoint,
    margin,
    circleRadius
  } = props;

  const width = +parent.attr('width');
  const height = +parent.attr('height');
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // x-axis
  const xScale = d3.scaleLinear()
    .domain([-20, 20])
    .range([0, innerWidth])
    .nice();

    // y-axis
  const yScale = d3.scaleLinear()
    .domain([-20, 20])
    .range([innerHeight, 0])
    .nice();

  
  // Container for inner margins
  const g = parent.selectAll('.container').data([null]);
  const gEnter = g
    .enter().append('g')
      .attr('class','container');

  gEnter
    .merge(g)
      .attr('transform', `translate(${margin.left},${margin.top})`);
  
        
  // Add a background rect to capture clicks
  const backgroundRect = g.select('.background-rect').data([null]);
  const backgroundRectEnter = gEnter
    .append('rect')
      .attr('class', 'background-rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'none')
      .attr('pointer-events', 'all');

  const xValue = d => d.x;
  const yValue = d => d.y;

  const xAxis = d3.axisBottom(xScale)
    .tickSize(-innerHeight)
    .tickPadding(15);

  const xAxisG = g.select('.x-axis');
  const xAxisGEnter = gEnter
    .append('g')
      .attr('class','x-axis')
      .attr('transform', `translate(0,${innerHeight})`);
  xAxisG
    .merge(xAxisGEnter)
      .call(xAxis)
      .select('.domain').remove();
  
  // Style the x-axis zero line and text
  xAxisG.merge(xAxisGEnter)
    .selectAll('.tick')
    .filter(d => d === 0)
    .select('line')
      .attr('stroke-width', 5)
      .attr('stroke', '#000');
  
  xAxisG.merge(xAxisGEnter)
    .selectAll('.tick')
    .filter(d => d === 0)
    .select('text')
      .style('font-weight', 'bold');
    

  const yAxis = d3.axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickPadding(10);

  const yAxisG = g.select('.y-axis');
  const yAxisGEnter = gEnter
    .append('g')
      .attr('class','y-axis');
  yAxisG
    .merge(yAxisGEnter)
      .call(yAxis)
      .select('.domain').remove();
      
  // Style the y-axis zero line and text
  yAxisG.merge(yAxisGEnter)
    .selectAll('.tick')
    .select('line')
      .attr('stroke', '#999')
    .filter(d => d === 0)
    .select('line')
      .attr('stroke-width', 5)
      .attr('stroke', '#000');
  
  yAxisG.merge(yAxisGEnter)
    .selectAll('.tick')
    .filter(d => d === 0)
    .select('text')
      .style('font-weight', 'bold');
  
  // title
  let title = 'Linear Regression Interactive Demo';
  const titleText = gEnter.merge(g)
    .selectAll('.title').data([null]);
  const titleTextEnter = titleText
    .enter().append('text')
      .attr('class','title')
      .attr('x', innerWidth/2)
      .attr('y', -10);
  titleTextEnter
    .merge(titleText)
      .text(title);
  
  // Plot data
  const circles = gEnter.merge(g)
    .selectAll('circle').data(data);
  const circlesEnter = circles
    .enter().append('circle')
      .attr('cx', innerWidth/2)
      .attr('cy', innerHeight/2)
      .attr('r', 0);
  circlesEnter
    .merge(circles)
    .attr('stroke-width', 3)
    .attr('cx', d => xScale(xValue(d)))
    .attr('cy', d => yScale(yValue(d)))
    .attr('r', circleRadius);
  
  circles.exit()
  .transition()
    .attr('r', 0)
    .remove();


  // zoom stuff
  const zoom = d3.zoom()
    .scaleExtent([0.5, 10])
    .extent([[0, 0], [innerWidth, innerHeight]])
    .on('zoom', (event) => {
      currentZoomTransform = event.transform; // Store the new transform
      
      // Update scales with zoom transform
      const newXScale = event.transform.rescaleX(xScale);
      const newYScale = event.transform.rescaleY(yScale);

      // Update axes
      xAxisG.merge(xAxisGEnter).call(xAxis.scale(newXScale))
        .select('.domain').remove();
      yAxisG.merge(yAxisGEnter).call(yAxis.scale(newYScale))
        .select('.domain').remove();

      // Update circles
      gEnter.merge(g)
        .selectAll('circle')
        .attr('cx', d => newXScale(xValue(d)))
        .attr('cy', d => newYScale(yValue(d)));

      // Maintain bold styling for zero lines
      xAxisG.merge(xAxisGEnter)
        .selectAll('.tick')
        .filter(d => d === 0)
        .select('line')
          .attr('stroke-width', 2)
          .attr('stroke', '#111');
      
      xAxisG.merge(xAxisGEnter)
        .selectAll('.tick')
        .filter(d => d === 0)
        .select('text')
          .style('font-weight', 'bold');

      yAxisG.merge(yAxisGEnter)
        .selectAll('.tick')
        .filter(d => d === 0)
        .select('line')
          .attr('stroke-width', 2)
          .attr('stroke', '#111');
      
      yAxisG.merge(yAxisGEnter)
        .selectAll('.tick')
        .filter(d => d === 0)
        .select('text')
          .style('font-weight', 'bold');
    });

  // Apply zoom to the container group and set initial transform
  gEnter.merge(g)
    .call(zoom)
    .call(zoom.transform, currentZoomTransform);
  
  // Handle clicks separately
  backgroundRectEnter
    .merge(backgroundRect)
      .on('click', (event) => {
        // Only add point if this was a simple click (not a drag or zoom)
        if (event.defaultPrevented) return;
        
        const [mouseX, mouseY] = d3.pointer(event);
        // Use the stored transform
        const newX = currentZoomTransform.rescaleX(xScale).invert(mouseX);
        const newY = currentZoomTransform.rescaleY(yScale).invert(mouseY);
        addPoint(newX, newY);
      });
  
};
