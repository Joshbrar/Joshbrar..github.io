function fetchMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var filteredData = metadata.filter(obj => obj.id == sample);
    var resultData = filteredData[0];
    // Use d3 to select the panel with id of `#sample_metadata`
    var set_panel = d3.select("#sample_metadata");
    // Use `.html("") to clear any existing metadata
    set_panel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(resultData).forEach(([key, value]) => {
      set_panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
    // BONUS: Build the Gauge Chart
    drawGuage(resultData.wfreq);
  });
}

function drawCharts(sample) {
  d3.json("samples.json").then((data) => {
    var sampleData = data.samples;
    var filteredData = sampleData.filter(obj => obj.id == sample);
    var resultData = filteredData[0];
    var _ids = resultData.otu_ids;
    var _labels = resultData.otu_labels;
    var sample_values = resultData.sample_values;
    // Build a Bubble Chart
    var bubbleChartLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30}
    };
    var bubbleChartData = [
      {
        x: _ids,
        y: sample_values,
        text: _labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: _ids,
          colorscale: "Earth"
        }
      }
    ];
    Plotly.newPlot("bubble", bubbleChartData, bubbleChartLayout);
    var yAxisticks = _ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var barData = [
      {
        y: yAxisticks,
        x: sample_values.slice(0, 10).reverse(),
        text: _labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };
    Plotly.newPlot("bar", barData, barLayout);
  });
}
function init() {
  // Grab a reference to the dropdown select element
  var ddl_select = d3.select("#selDataset");
  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var objNames = data.names;
    objNames.forEach((sample) => {  ddl_select.append("option").text(sample).property("value", sample);  });
    // Use the first sample from the list to build the initial plots
    var firstSample = objNames[0];
    drawCharts(firstSample);
    fetchMetadata(firstSample);
  });
}

function filterSubjectID(newSample) {
  // Fetch new data each time a new sample is selected
  drawCharts(newSample);
  fetchMetadata(newSample);
}

// Initialize the dashboard
init();
