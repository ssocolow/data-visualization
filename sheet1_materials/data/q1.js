const svg = d3.select('svg');
const width  = +svg.attr('width');
const height = +svg.attr('height');

d3.csv('cities_and_population.csv').then(data => {     // Data loading

    // convert all numeric data to numbers
    data.forEach(d => {
        d.population = Number(d.population);
        d.x = Number(d.x);
        d.y = Number(d.y);
    });

    // filter for only EU
    let eu = data.filter((d) => {
        return d.eu === "true";
    });
    render(eu);                            // Data rendering (calls 'render')
    // console.log(eu);
});

const render = data => {
    d3.select('h1')
        .text(`Number of cities: ${data.length}`);

    d3.select('svg')
      .selectAll('circle')                // select all existing circles (none)
      .data(data).enter()                 // create data join
      .append('circle')                   // append one circle per element
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => (d.population < 1000000) ? 4 : 8)
        // .attr('fill', d => (d.vegetarian == 'yes') ? 'green' : 'yellow');
    d3.select('svg')
        .selectAll('text')
        .data(data).enter()
        .append("text")
            .attr("x", d => d.x)          // X position of the text
            .attr("y", d => d.y - 10)          // Y position of the text
            .attr("opacity", d => d.population > 1000000 ? 1 : 0)
            .attr("class", "city-label")
            .text(d => d.city);
        
    
    
  };
