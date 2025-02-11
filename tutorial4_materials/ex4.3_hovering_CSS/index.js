import {showItems} from './showItems.js';

const svg = d3.select('svg');

const data = [
	{ 'type': 'meat',       'price': 40, 'id': 233 },
	{ 'type': 'fruit',      'price': 35, 'id':  58 },
	{ 'type': 'meat',       'price': 20, 'id': 112 },
	{ 'type': 'diary',      'price': 10, 'id': 779 },
	{ 'type': 'vegetables', 'price': 35, 'id': 287 },
	{ 'type': 'vegetables', 'price': 10, 'id':  11 },
	{ 'type': 'fruit',      'price': 50, 'id':  82 }
];

const updateVis = () => {
  showItems(svg, data);
};

// Initialise visualisation
updateVis();
