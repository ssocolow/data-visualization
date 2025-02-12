import { showCities } from './showCities.js';
import { checkBoxes } from './checkboxes.js';
const svg = d3.select('svg');

// checkboxes will create a checkbox for each option in options
// and each checkbox's onclick function updates the visualization by passing in the new selectedOptions 

// Global/state variables
let data;

let options = ['cities','labels'];
let selectedOptions = ['cities', 'labels'];
let labels = {
  cities: 'Show Cities',
  labels: 'Show Labels'
};
// ...

// Functions triggered by event listeners
// ...

const updateVis = () => {

  // refresh map
  svg.call(showCities, {
    data,
    selectedOptions
  });
};

d3.csv('cities_and_population.csv')
  .then(loadedData => {                    // data loading
    loadedData.forEach(d => {              // data parsing
      d.population = +d.population;
      d.x = +d.x;
      d.y = +d.y;
      d.eu = d.eu === 'true';
    });
    data = loadedData.filter(d => d.eu);   // filter data
    //...                                  // state initialisation
    // Initial state
    checkBoxes(d3.select('body'), {
      options,
      selectedOptions,
      labels,
      updateVis
    });
    updateVis();                           // init visualisation
  });