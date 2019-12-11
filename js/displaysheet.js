'use strict';
 
/* Immediately-Invoked Function Expression (IIFE) executes immediately after it’s created.
IIFE syntax : (function () { })(); */
(function () {

/* Syntax :  $(document ).ready(function () {});
ready() makes a function available after the document is loaded. 
Code written inside will run once the page DOM is ready to execute JS code. 
The snippet can also be placed in <script> tags of html file for non JS related actions  */
  $(document).ready(function () {
    // Initialises Tableau Data Extension
    tableau.extensions.initializeAsync().then(function () {
        refresh();
    }, function () { console.log('Error while Initializing: ' + err.toString()); });
  });
 
  function refresh() {
    // Gets a list of the worksheets and adds them to the web page.
    $("#worksheets").text("");
    tableau.extensions.dashboardContent.dashboard.worksheets.forEach(function (worksheet) {
        $("#worksheets").append("<button class='btn btn-secondary btn-block'>"+worksheet.name+"</button>");
    });
  }
   
})();