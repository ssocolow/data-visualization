import { scatterPlot }  from './scatterplot.js';
import { dropdownMenu } from './dropdownMenu.js';
const svg = d3.select('svg');

// Global/state variables
let data;
//...

const optionX = ['mpg','cylinders','displacement','horsepower','weight','acceleration','year','origin','name'];
const optionY = ['mpg','cylinders','displacement','horsepower','weight','acceleration','year','origin','name'];
let selectedOptionX = optionX[4];  // state (consistent with first item shown)
let selectedOptionY = optionY[0];  // state (consistent with first item shown)

const onOptionSelectedX = event => {
  //console.log(event)
  selectedOptionX = event.target.value;
  updateVis();
}

const onOptionSelectedY = event => {
  //console.log(event)
  selectedOptionY = event.target.value;
  updateVis();
}

const updateVis = () => {
  console.log(selectedOptionX, selectedOptionY);
  // menus
  // ...
  // Dropdown menu
  dropdownMenu(d3.select('#x-menu'), { options: optionX, onOptionSelected: onOptionSelectedX, selectedOption: selectedOptionX });
  dropdownMenu(d3.select('#y-menu'), { options: optionY, onOptionSelected: onOptionSelectedY, selectedOption: selectedOptionY });

  // Update text message on screen upon choosing an option
  // const message = d3.select('svg').selectAll('text').data([null]);
  // const messageEnter = message.enter().append('text')
  //   .attr('x', 100).attr('y', 50);
  // messageEnter.merge(message)
  //   .text('My selection is: ' + selectedOption);

  // refresh scatterPlot
  svg.call(scatterPlot, {
    data,
    margin: { top: 50, bottom: 80, left: 150, right: 40 },
    xValue: d => d[selectedOptionX],
    xAxisLabel: selectedOptionX,
    yValue: d => d[selectedOptionY],
    yAxisLabel: selectedOptionY,
    circleRadius: 10
  });
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

    updateVis();                        // Init visualisation
  });

