export const checkBoxes = (parent, props) => {
    // unpack my props
    const {
      options,
      selectedOptions,
      labels,
      updateVis
    } = props;
    console.log("Options:", options); // Debug: Check if we have data
    console.log("Labels:", labels); // Debug: Check if we have data

    // Groups to have together city marks and their labels
    const checkboxesDiv = parent.select('#checkboxes');
    console.log("Checkboxes Div:", checkboxesDiv);

    const g = checkboxesDiv.selectAll('div').data(options);

    console.log("G:", g);
    // make a checkbox for each option
    const gEnter = g.enter()
      .append('div')
      .each(function(d) {
        console.log(d);

        // create checkbox
        d3.select(this).append('input')
        .attr('type', 'checkbox')
        .attr('id', function(d) { return d; })
        .attr('checked', function(d) { return selectedOptions.includes(d); })
        .on('click', function() {
          const d = d3.select(this).datum(); // Get the data bound to this element
          console.log(selectedOptions);
          if (selectedOptions.includes(d)) {  
            selectedOptions.splice(selectedOptions.indexOf(d), 1);
          } else {
            selectedOptions.push(d);
          }
          console.log(selectedOptions);
          updateVis();
        })

        // create label
        d3.select(this).append('label')
        .attr('for', function(d) { return d; })
        .text(function(d) { return labels[d]; });
      });
  
    // // Handle possible changes in circles and labels (opacity)
    // // Use: gEnter.merge(g)...
    // gEnter.merge(g)
    //   .selectAll('circle')
    //   .attr('opacity', selectedOptions.includes('cities') ? 1 : 0);
  
    // gEnter.merge(g)
    //   .selectAll('text')
    //   .attr('opacity', d => selectedOptions.includes('labels') ? (d.population < 1000000 ? 0 : 1) : 0);
  
    // Remove elements when data is removed
    g.exit().remove();
  };
  