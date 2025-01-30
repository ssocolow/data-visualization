// Ordinal scale to map the basic colours into more pleasant tones
const colourScale = d3.scaleOrdinal()
  .domain(['red', 'yellow', 'green', 'blue'])
  .range(['#d12013', '#f1e423', '#19ce13', '#3838a1']);

export const showFruits = (parent, props) => {
  // Unpack my properties
  const {fruits, height} = props;

  const background = parent.selectAll('rect')
    .data([null])
    .enter().append('rect')
      .attr('width', 800)
      .attr('height', 200)
      .attr('y', 160)
      .attr('rx', 80);

  const groups = parent.selectAll('g')
    .data(fruits, d => d.type); 
  const groupsEnter = groups.enter().append('g')
    .attr('transform', (d,i) => `translate(${(i * 100) + 80},${height/2})`);
  groupsEnter.merge(groups)
    .transition().duration(1000)
      .attr('transform', (d,i) => `translate(${(i * 100) + 80},${height/2})`);
  groups.exit().remove();

  const circle = groups.select('circle');
  groupsEnter.append('circle')
    .merge(circle)
      .transition().duration(1000)
        .attr('fill', d => colourScale(d.colour))
        .attr('r', d => d.amount);
    
  const label = groups.select('text');
  groupsEnter.append('text')
    .merge(label)
      .attr('y',80)
      .transition().duration(1000)
        .text(d => d.type);
      
}
