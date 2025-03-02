import { scatterplot }  from './scatterplot.js';
import { barchart }  from './barchart.js';
const svg = d3.select('svg');

// Global/state variables
let data;
const difficultyLevels = ['Easy','Intermediate','Difficult'];
let selectedDifficulty = ['Easy','Intermediate','Difficult'];
const dataBars = [];

// function to change the selected difficulty
function changeSelectedDifficulty(difficulty) {
  selectedDifficulty = difficulty;
  updateVis();
  // console.log(selectedDifficulty);
}

function getSelectedDifficulty() {
  return selectedDifficulty;
}

// when user clicks on a bar, change the state and updateVis to only show certain parts of the data
// Colour scale (shared between views)
const colourScale = d3.scaleOrdinal()
  .range(['#b1e8a5', '#7bc77e', '#2a8d46']) // light green to dark green
  .domain(difficultyLevels);


const updateVis = () => {

  // refresh scatterplot
  svg.call(scatterplot, {
    data: data,
    margin: { top: 40, bottom: 50, left: 30, right: 380 },
    xValue: d => d.distance,
    xAxisLabel: 'Distance',
    yValue: d => d.time,
    yAxisLabel: 'Hours',
    colourScale,
    colourValue: d => d.difficulty,
    getSelectedDifficulty
  });

  // refresh barchart
  svg.call(barchart, {
    data: dataBars,
    margin: { top: 40, bottom: 50, left: 700, right: 30 },
    xValue: d => d.level,
    xTickLabels: difficultyLevels,
    yValue: d => d.count,
    yAxisLabel: 'Trails',
    colourScale,
    colourValue: d => d.level,
    changeSelectedDifficulty,
    getSelectedDifficulty
  });

};

// Data loading, preprocessing, and init visualisation
d3.csv('./data/vancouver_trails.csv')
  .then(loadedData => {
    data = loadedData;
    // Data parsing
    data.forEach(d => {
      d.time = +d.time;
      d.distance = +d.distance;
    });

    // Calculate counts per each of the difficulty levels
    difficultyLevels.forEach(level => {
      const count = data.filter(d => d.difficulty == level).length;
      dataBars.push( {level: level, count: count} );
    });

    // Init visualisation
    updateVis();
  });

