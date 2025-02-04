import { scatterPlot } from './scatterplot.js'

const svg = d3.select('svg');

let data;                              // data now made global

const render = () => {

  svg.call(scatterPlot, {
    data,
    margin: { top: 50, bottom: 80, left: 150, right: 40 },
    xValue: d => d.horsepower,
    xAxisLabel: 'Horsepower',
    yValue: d => d.weight,
    yAxisLabel: 'Weight',
    circleRadius: 10
  });

  // Add timed second-call to the scatterplot module
  // ...
  setTimeout(() => {              // Implement delay
    svg.call(scatterPlot, {
      data,
      margin: { top: 50, bottom: 80, left: 150, right: 40 },
      xValue: d => d.displacement,
      xAxisLabel: 'Displacement',
      yValue: d => d.acceleration,
      yAxisLabel: 'Acceleration',
      circleRadius: 10
    });
  }, 3000);

};

d3.csv('auto-mpg.csv')
  .then(loadedData => {                 // Data loading
    data = loadedData;
    data.forEach(d => {                 // Data parsing
      d.mpg = +d.mpg;
      d.cylinders = +d.cylinders;
      d.displacement = +d.displacement;
      d.horsepower = +d.horsepower;
      d.weight = +d.weight
      d.acceleration = +d.acceleration;
      d.year = +d.year;
    });
    render();                          // Data rendering
  });

