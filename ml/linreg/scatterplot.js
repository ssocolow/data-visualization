// Store zoom state outside the component
let currentZoomTransform = d3.zoomIdentity;

export const scatterPlot = (parent, props) => {
  // unpack my props
  const {
    data,
    addPoint,
    margin,
    circleRadius,
    drawLine,
    param1,
    param2,
    redData,
    blueData,
    chosenAlgo,
    preserveGradient,
    decisionBoundaryVisualPoints
  } = props;
  console.log("Receiving decisionBoundaryVisualPoints as:", decisionBoundaryVisualPoints);


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
      .attr('class', 'container');

  // Merge and transform the container, but preserve existing content if preserveGradient is true
  if (preserveGradient) {
    // Only update the transform, don't recreate the container
    parent.select('.container')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  } else {
    gEnter
      .merge(g)
        .attr('transform', `translate(${margin.left},${margin.top})`);
  }

  // Store existing gradient rect if we need to preserve it
  let existingGradient;
  if (preserveGradient) {
    existingGradient = parent.select('.container').select('.heatmap-rect');
  }

  // Add a background rect to capture clicks
  const backgroundRect = g.select('.background-rect').data([null]);
  const backgroundRectEnter = gEnter
    .append('rect')
      .attr('class', 'background-rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'none')
      .attr('pointer-events', 'all');

  // If we preserved the gradient, make sure it's the first child
  if (existingGradient.size() > 0) {
    existingGradient.raise();
    backgroundRect.raise();
  }

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
  let title = 'ML prediction algorithms visualization';
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
    .attr('r', circleRadius)
    .attr('fill', d => {
      if (chosenAlgo === 'linearRegression') {
        return 'orange';
      } else {
        if (redData.includes(d)) {
          return 'red';
        } else {
          return 'blue';
        }
      }
    });
  
  circles.exit()
  .transition()
    .attr('r', 0)
    .remove();
  
  // show decision boundary if in logistic regression
  if (chosenAlgo == "logistic") {
    console.log("Decision boundary points:", decisionBoundaryVisualPoints);
    
    // Plot decision boundary points
    const circles2 = gEnter.merge(g)
      .selectAll('circle.decision-boundary-point')
      .data(decisionBoundaryVisualPoints.filter(d => d.probability !== undefined));
    
    // Handle exit selection with transition
    circles2.exit()
      .transition()
      .duration(200)
      .attr('r', 0)
      .remove();
    
    // Handle enter selection
    const circlesEnter2 = circles2
      .enter()
      .append('circle')
      .attr('class', 'decision-boundary-point')
      .attr('r', 0)  // Start with radius 0
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y));
    
    // Update both enter and existing points
    circles2
      .merge(circlesEnter2)
      .transition()
      .duration(200)
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(-d.y))  // Negate y to match the training data
      .attr('r', circleRadius)
      .attr('fill', d => d.probability > 0.5 ? "blue" : "red")
      .style('opacity', 0.2);
  } else {
    // Remove decision boundary points when not in logistic mode with transition
    gEnter.merge(g)
      .selectAll('circle.decision-boundary-point')
      .transition()
      .duration(200)
      .attr('r', 0)
      .remove();
  }

  // draw a line if doing lin reg
  if (drawLine) {
    console.log('Drawing line with params:', param1, param2);  // Debug log
    // Create line data points from domain bounds
    const x0 = xScale.domain()[0];
    const x1 = xScale.domain()[1];
    const y0 = parseFloat(param1) + parseFloat(param2) * x0;
    const y1 = parseFloat(param1) + parseFloat(param2) * x1;
    
    const lineData = [
      { x: x0, y: y0 },
      { x: x1, y: y1 }
    ];
    
    console.log('Line data:', lineData);  // Debug log
    
    // Validate line data
    if (lineData.some(d => isNaN(d.x) || isNaN(d.y))) {
      console.error('Invalid line coordinates generated');
      return;
    }

    // Create line generator
    const lineGenerator = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));
    
    // Draw the line - modified selection pattern
    const regressionLine = gEnter.merge(g).selectAll('.regression-line').data([lineData]);
    
    // Handle enter selection
    const regressionLineEnter = regressionLine
      .enter()
      .append('path')
        .attr('class', 'regression-line')
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('stroke-width', 2);

    // Update both enter + update selections
    regressionLineEnter
      .merge(regressionLine)
        .attr('d', lineGenerator);
        
    // Remove line when drawLine is false
    regressionLine.exit().remove();
  } else {
    // Remove the line if drawLine is false
    gEnter.merge(g).selectAll('.regression-line').remove();
  }


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

      // Update regression line if it exists
      if (drawLine) {
        const lineData = [
          { x: newXScale.domain()[0], y: parseFloat(param1) + parseFloat(param2) * newXScale.domain()[0] },
          { x: newXScale.domain()[1], y: parseFloat(param1) + parseFloat(param2) * newXScale.domain()[1] }
        ];

        const lineGenerator = d3.line()
          .x(d => newXScale(d.x))
          .y(d => newYScale(d.y));

        gEnter.merge(g).select('.regression-line')
          .attr('d', lineGenerator(lineData));
      }

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
        if (chosenAlgo == "linear") {
          addPoint(newX, newY);
        } else {
          if (d3.select('#red-or-blue').value == "red") {
            redData.push({
              x: newX,
              y: newY
            })
            console.log(redData);
          }
        }
      });
  
};
