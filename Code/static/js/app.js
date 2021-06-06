//1. Use the D3 library to read in `samples.json`
d3.json('samples.json').then(data=>{
    // Create variable for the names/test subject IDs 
    var names = data.names;
    // Append as an option to the dropdown on the html id "selDataset" each name/id
    names.forEach(name => {
        d3.select('#selDataset').append('option').text(name);
    });

    createCharts();
});

// Create event handler that will change the chart displayed by running the createCharts function
function handleid() {
    d3.event.preventDefault();
    createCharts();
}


// Create function that generates the chart. 
function createCharts() {
    // Read in the data from the JSON file in the function 
    d3.json("samples.json").then((importedData) => {
        // Store the value of the html id "selDataset" to new variable selection. 
        var selection = d3.select('#selDataset').node().value;
        // Filter the samples in the JSON for only those where the id matches the selection
        var sample = importedData.samples.filter(obj => obj.id == selection)[0];
        console.log(importedData.samples);
        console.log(sample);
        // Select only the top 10 OTUs by volume for plotting the bar chart. 
        // Use reverse to have the chart display the highest volume OTU top down 
        var values = sample.sample_values.slice(0, 10).reverse();
            // Add OTU in fron of the ID number for labelling purposes on the chart/graph.
        var ids = sample.otu_ids.slice(0, 10).reverse().map(x => 'OTU ' + x);
        var labels = sample.otu_labels.slice(0, 10).reverse();

        // Store metadata data for Demographic Info section 
        var metadata = importedData.metadata;
        
        var result = metadata.filter(obj => obj.id.toString() === selection)[0];
        console.log(result);

        var demographics = d3.select("#sample-metadata");

        demographics.html("");

        Object.entries(result).forEach((key) => {
            demographics.append("h4").text(key[0] + ": " + key[1] + "\n");
        });

        // Create the trace
        var trace1 = {
            x: values,
            y: ids,
            text: labels,
            name: "Top Operational Taxonomic Units (OTUs)",
            marker: {color: '#ff7f0e'},
            type: "bar",
            orientation: "h"
        };

        var data = [trace1];

        // Title and labels
        var layout = {
            title: "Top Operational Taxonomic Units (OTUs)",
            xaxis: { title: "OTU Volume" },
            yaxis: { title: "OTU ID" }
        };

        // Plot bar chart
        Plotly.newPlot("bar", data, layout);

        // Use reverse to have the chart display the highest volume OTU top down 
        var values_raw = sample.sample_values;
        var ids_raw = sample.otu_ids;
        var labels_raw = sample.otu_labels;

        var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: { t: 0 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            margin: { t: 30},
            
          };
        
          var bubbleData = [
            {
              x: ids_raw,
              y: values_raw,
              text: labels_raw,
              mode: "markers",
              colorscale: "Jet",
              marker: {
                size: values_raw,
                color: ids_raw,
                colorscale: "Jet"
              }
            }
          ];
          
          Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
};

// Add event listener
d3.selectAll("body").on("change", handleid);
