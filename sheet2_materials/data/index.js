let data;

d3.csv('aid-data.csv')
  .then(loadedData => {                 // Data loading
    data = loadedData;
    data.forEach(d => {                 // Data parsing
      d.aiddata_id = +d.aiddata_id;
      d.year = +d.year;
      d.commitment_amount_usd_constant = +d.commitment_amount_usd_constant;
      d.coalesced_purpose_code = +d.coalesced_purpose_code;
      // donor, recipient, and coalesced_purpose_name remain as strings
    });
    render();                          // Data rendering
  });

function render() {
    console.log(data);
}