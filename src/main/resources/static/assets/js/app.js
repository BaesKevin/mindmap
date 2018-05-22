$(document).foundation();

$(document).ready(function(){
   document.getElementById("exportButton").onclick = exportNetwork;

   addOnlineOfflineEventListeners();
   importNetwork();
   
});

