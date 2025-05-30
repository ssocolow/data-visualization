import { loadAndProcessData } from './loadAndProcessData.js'
import { worldmapSymbols } from './worldmapSymbols.js'

const svg = d3.select('svg');
let countries, symbolsData;

const updateVis = () => {
  worldmapSymbols(svg, {  
    countries,
    symbolsData
  })
};

loadAndProcessData().then(loadedData => {
  countries   = loadedData[0];
  symbolsData = loadedData[1];
  updateVis();
});

