// Set up SVG dimensions and margins
const margin = { top: 40, right: 40, bottom: 40, left: 40 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG container
const svg = d3.select("#visualization")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("border", "1px solid black")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Add axes
const xScale = d3.scaleLinear()
    .domain([0, width])
    .range([0, width]);

const yScale = d3.scaleLinear()
    .domain([height, 0])
    .range([height, 0]);

const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

svg.append("g")
    .call(yAxis);

// Initialize empty points array
let points = [];

// Add click event handler
svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all")
    .on("click", function(event) {
        const coords = d3.pointer(event);
        points.push(coords);
        updateVisualization();
    });

// Function to calculate linear regression
function calculateRegression(points) {
    const n = points.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;
    let sumYY = 0;

    points.forEach(point => {
        sumX += point[0];
        sumY += point[1];
        sumXY += point[0] * point[1];
        sumXX += point[0] * point[0];
        sumYY += point[1] * point[1];
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate R-squared
    const meanY = sumY / n;
    let totalSS = 0;  // Total sum of squares
    let residualSS = 0;  // Residual sum of squares

    points.forEach(point => {
        const predictedY = slope * point[0] + intercept;
        totalSS += Math.pow(point[1] - meanY, 2);
        residualSS += Math.pow(point[1] - predictedY, 2);
    });

    const rSquared = 1 - (residualSS / totalSS);

    return { slope, intercept, rSquared };
}

// Function to update visualization
function updateVisualization() {
    // Update points
    const circles = svg.selectAll("circle")
        .data(points);

    circles.enter()
        .append("circle")
        .merge(circles)
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])
        .attr("r", 5)
        .style("fill", "steelblue");

    circles.exit().remove();

    // Update regression line
    if (points.length >= 2) {
        const regression = calculateRegression(points);
        
        // Remove existing line and R² text
        svg.selectAll(".regression-line").remove();
        svg.selectAll(".r-squared-text").remove();
        
        // Calculate line points
        const x1 = 0;
        const y1 = regression.intercept + regression.slope * x1;
        const x2 = width;
        const y2 = regression.intercept + regression.slope * x2;

        // Draw regression line
        svg.append("line")
            .attr("class", "regression-line")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .style("stroke", "red")
            .style("stroke-width", 2);

        // Add R² text
        svg.append("text")
            .attr("class", "r-squared-text")
            .attr("x", 10)
            .attr("y", 20)
            .text(`R² = ${regression.rSquared.toFixed(3)}`)
            .style("font-size", "12px");
    }
}

// Add reset button functionality
d3.select("#resetButton").on("click", function() {
    points = [];
    svg.selectAll("circle").remove();
    svg.selectAll(".regression-line").remove();
    svg.selectAll(".r-squared-text").remove();
});
