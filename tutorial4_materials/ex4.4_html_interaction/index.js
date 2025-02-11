import { dropdownMenu } from './dropdownMenu.js';

const options = ['A', 'B', 'C'];
let selectedOption = options[0];  // state (consistent with first item shown)

const onOptionSelected = event => {
  //console.log(event)
  selectedOption = event.target.value;
  updateVis();
}

const updateVis = () => {
  // Dropdown menu
  dropdownMenu(d3.select('#menus'), { options, onOptionSelected });

  // Update text message on screen upon choosing an option
  const message = d3.select('svg').selectAll('text').data([null]);
  const messageEnter = message.enter().append('text')
    .attr('x', 100).attr('y', 50);
  messageEnter.merge(message)
    .text('My selection is: ' + selectedOption);
};

// Initialise visualisation
updateVis();

