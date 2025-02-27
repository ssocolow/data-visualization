class StackedAreaChart {
  /**
   * Class constructor with basic chart configuration
   * @param _parent {D3 selection}
   * @param _props  {Object}
   */
  constructor(_parent, _props, _data) {
    this.parent = _parent;
    this.props = {
      data: _props.data,
      margin: _props.margin,
      displayType: _props.displayType
    };
    this.initVis();
  }
  
  /**
   * initVis(): Class method to initialise scales/axes and append static chart elements
   */
  initVis() {
    let vis = this;

    // Margin conventions
    const width  = +this.parent.attr('width');
    const height = +this.parent.attr('height');
    const innerWidth  = width - vis.props.margin.left - vis.props.margin.right;
    const innerHeight = height - vis.props.margin.top - vis.props.margin.bottom;

    // Scales for axes
    vis.xScale = d3.scaleLinear()
        .domain(d3.extent(vis.props.data, d => d.year))
        .range([0, innerWidth])
        .nice();

    vis.yScale = d3.scaleLinear()
        .range([innerHeight, 0]);

    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale)
        .tickFormat(d3.format("d")); // Remove thousand comma

    vis.yAxis = d3.axisLeft(vis.yScale)
        .tickSize(-innerWidth)
        .tickPadding(10);

    // Append group element that will contain our actual chart
    vis.chart = vis.parent.append('g')
        .attr('transform', `translate(${vis.props.margin.left},${vis.props.margin.top})`);

    // Append empty x-axis group
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${innerHeight})`);
    
    // Append y-axis group
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis');

    // Append y-axis title
    vis.axisTitle = vis.yAxisG.append('text')
        .attr('class', 'axis-title')
        .attr('x', 30)
        .attr('y', -17)
        .text('Trillion m\u00B3');
  };

  /**
   * updateVis(): Class method to update visualisation
   */
  updateVis() {
    let vis = this;

    // Prepare the data for using it in a stack
    // 1. Group the data per year
    // ...

    // Calculate relative contribution (in %) of each region per year
    // ...

    // 2. Define stack and data accessors (according to display type)
    // ...
    
    // 3. Produce the stacked data
    // ...

    // Set the y-axis scale input domains upon changes in displayType
    // ...

    // Update the axes
    // ...

    // Colour scale and area generator
    const colorScale = d3.scaleOrdinal()
        .domain([0,1,2])
        .range(['#6080b5', '#5a9866', '#f7dc7a']);
    
    // ...

    // Add area paths
    // ...
  }
}