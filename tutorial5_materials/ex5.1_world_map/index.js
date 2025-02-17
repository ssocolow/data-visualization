const svg = d3.select('svg');
const width  = +svg.attr('width');
const height = +svg.attr('height');

// Define geographic projection and path generator
const projection = d3.geoNaturalEarth1();
const pathGenerator = d3.geoPath().projection(projection);

// Group to enter our map elements and facilitate zoom
const g = svg.append('g');

// Earth's sphere border
g.append('path')
    .attr('class', 'sphere')
    .attr('d', pathGenerator({type: 'Sphere'}));

// d3-zoom 
g.call(d3.zoom()
    .scaleExtent([1, 8])
    .translateExtent([[0, 0], [width, height]])
    .on('zoom', event => g.attr('transform', event.transform)));

// Load shapes of world countries (TopoJSON)
d3.json('countries-110m.json')
  .then(data => {
    // console.log(data);
    // Convert TopoJSON to GeoJSON
    const countries = topojson.feature(data, data.objects.countries);
    
    // console.log(countries);
    // Render the map by using the path generator
    g.selectAll('path').data(countries.features)
      .enter().append('path')
        .attr('class','country')
        .attr('d', pathGenerator)
      .append('title')
        .text(d => d.properties.name);
    });

