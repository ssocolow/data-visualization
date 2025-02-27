export const horizontalLinkTree = (parent, props) => {
  // unpack my props
  const {
    data,
    margin
  } = props;

  // Standard margin conventions
  const width  = +parent.attr('width');
  const height = +parent.attr('height');
  const innerWidth  = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Chart taking care of inner margins
  const chart = parent
    .append('g')
      .attr('class','chart')
      .attr('transform', `translate(${margin.left},${margin.top})`);

  // Implement tree chart
  // ...

};

