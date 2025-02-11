import { showCities } from './showCities.js';
const svg = d3.select('svg');

// Global/state variables
let data;
// ...

// Functions triggered by event listeners
// ...

const updateVis = () => {
  // checkboxes
  // ...

  // refresh map
  svg.call(showCities, {
    data
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
    updateVis();                           // init visualisation
  });
