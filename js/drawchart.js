'use strict';
  
(function () {
   $(document).ready(function () {
      // Initialises Tableau Data Extension
      tableau.extensions.initializeAsync().then(function () {
      // Once we initialize we call the drawChartJS function.
      drawChartJS();
   }, function () { console.log('Error while Initializing: ' + err.toString()); });
   });
 
   // This javascript function gets data from our worksheet and draws the Doughnut.
   function drawChartJS() {
      // Gets all the worksheets in a Tableau Dashboard
      const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
      // Find the relevant worksheet
      var worksheet = worksheets.find(function (sheet) {
         return sheet.name === "TableauBar";
      });
 
      // Call a function on the worksheet Object to get the Summary Data.
      worksheet.getSummaryDataAsync().then(function (sumdata) {
         // Create an empty arrays for our labels and data set.
         var labels = [];
         var data = [];
          
         // We get our summary data:
         var worksheetData = sumdata.data;
         // We loop through our summary data and hardcode which columns goes into Label
         // and which column goes into the array.
         for (var i = 0; i < worksheetData.length; i++) {
            labels.push(worksheetData[i][0].formattedValue);
            data.push(worksheetData[i][1].value);
         }
 
         // Draw the chart as before.
         var ctx = $("#myChart");
       
         var myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
               labels: labels, // This now comes from Tableau
               datasets: [{
                  backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
                  data: data // This now comes from Tableau
               }]
            }
         });
      });
   }
})();