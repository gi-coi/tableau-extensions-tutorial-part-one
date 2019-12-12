"use strict";

(function() {
  $(document).ready(function() {
    /* Initialise extension */
    tableau.extensions.initializeAsync().then(
      function() {
        /*  Once the extension is initialised, draw the chart*/

        drawChart();
      },
      function() {
        console.log("Error while Initializing: " + err.toString());
      }
    );
  });

  function drawChart() {
    // Gets all the worksheets in a Tableau Dashboard
    const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
    // Find the relevant worksheet
    var worksheet = worksheets.find(function(sheet) {
      return sheet.name === "TableauBar";
    });

    // Call a function on the worksheet Object to get the Summary Data.
    worksheet.getSummaryDataAsync().then(function(DataTable) {
      /* Convert the data to a JS-friendly object */
      let data = convertObject(DataTable);
      console.log(data);

      // set the dimensions and margins of the graph
      var margin = { top: 10, right: 30, bottom: 40, left: 100 },
        width = 460 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

      // append the svg object to the body of the page
      var svg = d3
        .select("#chartContainer")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      /* X scale is a linear scale (sum of sales) */
      var x = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(data, d => {
            return d["SUM(Sales)"];
          })
        ])
        .range([0, width]);

      /* Create the container x axis, create X axis using the scale */
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")

        .call(d3.axisBottom(x));

      /* Y scale is a categorical scale (Regions) */
      var y = d3
        .scaleBand()
        .range([0, height])
        .domain(
          data.map(function(d) {
            return d.Region;
          })
        )
        .padding(1);
      /* Create y axis */
      svg.append("g").call(d3.axisLeft(y));

      data.sort(function(a, b) {
        console.log(a["SUM(Sales)"]);
        return a["SUM(Sales)"] - b["SUM(Sales)"];
      });

      /* Lines for our lollipops
      They all start from 0 and are aligned based on the Y scale we created before
      Therefore, we will have one line per region */
      svg
        .selectAll("myline")
        /* Attach the data to the lines
        d3 understands how many entries we have based on the data we put in
        In this case, 4 entries = 4 lines
        d3 doesn't actually compare the content of the data, but uses each entry as an "ID"
        This is important when we need to update the chart and there are multiple parameters involved
        Specify the right ID to make sure d3 detects the changes in the data and updates the chart
        */
        .data(data)
        /* Create as many lines as needed */
        .enter()
        .append("line")
        .attr("x1", function(d) {
          return x(d["SUM(Sales)"]);
        })
        .attr("x2", x(0))
        .attr("y1", function(d) {
          return y(d.Region);
        })
        .attr("y2", function(d) {
          return y(d.Region);
        })
        .attr("stroke", "grey");

      /* Updating a chart: this is sometimes necessary when for example we are using filters
        When using d3.v4, updating works in three steps:
        - enter().append(element) the elements you need (for example, enter 4 new lines)
        - merge (with the pre-existing elements) 
        - exit().remove() to remove elements you don't need anymore

        If using d3.v5, you just need to .join()
      */

      // Circles
      svg
        .selectAll("mycircle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
          return x(d["SUM(Sales)"]);
        })
        .attr("cy", function(d) {
          return y(d.Region);
        })
        .attr("r", "7")
        .style("fill", "#69b3a2")
        .attr("stroke", "black");
    });
  }

  function convertObject(table) {
    /* Takes the dashboard's DataTable object as input
      Extracts the column names, then builds a new JS Object
      using column names as keys ans the cells' values as values
      As the columns and the cells have the same order, they can use
      The same index when you loop through them */
    let newObj = [];
    // Extract the colum names
    let columns = table.columns.map(col => {
      return col.fieldName;
    });

    for (let i = 0; i < table.data.length; i++) {
      /* Loop through the rows */
      let temp = {};
      // for each row, build a temporary object
      for (let k = 0; k < columns.length; k++) {
        /* Extract the corresponding value for each column */
        temp[columns[k]] = table.data[i][k].value;
      }
      // push these to a new object
      newObj.push(temp);
    }

    return newObj;
  }
})();
