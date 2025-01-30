// import {showFruits} from './showFruits_v1.js';
import {showFruits} from './showFruits_v2.js';

const svg = d3.select('svg');

const updateVis = () => {
  showFruits(svg, {
    fruits, 
    height: +svg.attr('height')
  })
};

let fruits = [
	{"type": "grape",      "amount": 40, "colour": "green"},
	{"type": "kiwi",       "amount": 35, "colour": "green"},
	{"type": "banana",     "amount": 20, "colour": "yellow"},
	{"type": "mango",      "amount": 10, "colour": "yellow"},
	{"type": "strawberry", "amount": 35, "colour": "red"},
	{"type": "papaya",     "amount": 10, "colour": "yellow"},
	{"type": "blueberry",  "amount": 50, "colour": "blue"}
];

// Initialise visualisation
updateVis();
// Double your provision of papayas
setTimeout(() => {
  let index = fruits.findIndex(d => d.type === "papaya");
  fruits[index].amount *= 2;
  updateVis();
}, 1000)
// Eat all strawberries
setTimeout(() => {
  fruits = fruits.filter(d => d.type !== "strawberry");
  updateVis();
}, 2000);
// Eat half of your blueberries
setTimeout(() => {
  let index = fruits.findIndex(d => d.type === "blueberry");
  fruits[index].amount /= 2;
  updateVis();
}, 3000)
// Your grapes turn red
setTimeout(() => {
  let index = fruits.findIndex(d => d.type === "grape");
  fruits[index].colour = "red";
  updateVis();
}, 4000)

