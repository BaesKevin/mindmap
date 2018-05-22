$(document).foundation();

$(document).ready(function(){
   document.getElementById("exportButton").onclick = exportNetwork;
   document.getElementById("saveAndQuitButton").onclick = saveAndGoHome;

   addOnlineOfflineEventListeners();
   importNetwork();
   
   let networkname = getQueryStringParam('name');
   $('h1').text(networkname);
});

