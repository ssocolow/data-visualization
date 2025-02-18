import { loadAndProcessData } from './loadAndProcessData.js'
import { choroplethMap } from './choroplethMap.js'
import { colourLegend } from './colourLegend.js'

const svg = d3.select('svg');

// Global variables
let countries;
let selectedEconomy = ['1. Developed region: G7', '2. Developed region: nonG7', '3. Emerging region: BRIC', '4. Emerging region: MIKT', '5. Emerging region: G20', '6. Developing region', '7. Least developed region'];

function onEconomySelect(newEconomy) {
  selectedEconomy = newEconomy;
}

function doesInclude(ec) {
  return selectedEconomy.includes(ec);
}

const updateVis = () => {
  // data accessor to select feature that we'll use as colour
  const colourValue = d => d.properties.economy;
  // colour scale to be used (from d3-scale-chromatic -- standard D3 bundle)
  const colourScale = d3.scaleOrdinal();
  colourScale.domain(countries.features.map(colourValue).sort());
  colourScale.range(d3.schemeOranges[colourScale.domain().length]);

  choroplethMap(svg, {
    countries,
    colourValue,
    colourScale,
    doesInclude
  });

  colourLegend(svg, {
    colourScale,
    circleRadius: 10,
    spacing: 20,
    textOffset: 20,
    selectedEconomy,
    onEconomySelect
  });

};

loadAndProcessData().then(loadedData => {
  countries = loadedData;
  updateVis();
});

