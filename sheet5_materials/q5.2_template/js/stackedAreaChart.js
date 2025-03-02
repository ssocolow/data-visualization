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

    // Add x-axis
    vis.xAxisG.call(vis.xAxis);

    // Add y-axis
    vis.yAxisG.call(vis.yAxis);
  };

  /**
   * updateVis(): Class method to update visualisation
   */
  updateVis() {
    let vis = this;

    // Prepare the data for using it in a stack
    // 1. Group the data per year
    // so we get [{year: 2010,  BRICS: 0.1, OECD: 0.2, ROW: 0.7}, {year: 2011, BRICS: 0.15, OECD: 0.25, ROW: 0.6}]
    const years = new Set(vis.props.data.map(d => d.year));
    const yearlyData = [];
    for (const year of years) {
      const data = vis.props.data.filter(d => d.year === year);
      const BRICS = data.filter(d => d.region === 'BRICS')[0]['freshwater_use'];
      const OECD = data.filter(d => d.region === 'OECD')[0]['freshwater_use'];
      const ROW = data.filter(d => d.region === 'ROW')[0]['freshwater_use'];
      yearlyData.push({year, BRICS, OECD, ROW});
    }
  
    console.log(yearlyData);

    // Calculate relative contribution (in %) of each region per year
    const relativeContribution = [];
    for (const year of yearlyData) {
      const total = year.BRICS + year.OECD + year.ROW;
      relativeContribution.push({
        year: year.year,
        BRICS: year.BRICS / total,
        OECD: year.OECD / total,
        ROW: year.ROW / total
      });
    }
    console.log(relativeContribution);

    // 2. Define stack and data accessors (according to display type)
    const stack = d3.stack()
        .keys(["BRICS", "OECD", "ROW"])
        .value((d, key) => d[key]);
    
    // 3. Produce the stacked data
    let stackedData;
    if (vis.props.displayType === 'relative') {
      stackedData = stack(relativeContribution);
      console.log(stackedData);
    } else {
      stackedData = stack(yearlyData);
      console.log(stackedData);
    }

    // Set the y-axis scale input domains upon changes in displayType
    if (vis.props.displayType === 'relative') {
      vis.yScale.domain([0, 1]);
      // Update axis format for percentages
      vis.yAxis.tickFormat(d => d3.format(".0%")(d));
    } else {
      vis.yScale.domain([0, 4]);
      // Update axis format for absolute values
      vis.yAxis.tickFormat(d3.format(".1f"));
    }

    // Redraw the axes with new scales
    vis.xAxisG.call(vis.xAxis);
    vis.yAxisG.call(vis.yAxis);

    // Colour scale and area generator
    const colorScale = d3.scaleOrdinal()
        .domain([0,1,2])
        .range(['#6080b5', '#5a9866', '#f7dc7a']);
    
    // Create area generator
    const area = d3.area()
        .x(d => vis.xScale(d.data.year))
        .y0(d => vis.yScale(d[0]))
        .y1(d => vis.yScale(d[1]));

    // Draw the areas
    const areas = vis.chart.selectAll('.area')
        .data(stackedData);

    areas.enter()
        .append('path')
        .merge(areas)
        .transition()
        .duration(1000)
        .attr('class', 'area')
        .attr('d', area)
        .attr('fill', d => colorScale(d.key));

    // Remove old areas
    areas.exit().remove();

  }
}