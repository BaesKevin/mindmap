import VisNetwork from "./models/VisNetwork.js";
import VisNetworkData from "./models/VisNetworkData.js";
import ConnectionStatusModule from "./models/ConnectionStatusModule.js";
import persistence from "./models/VisNetworkPersistence.js";

$(document).foundation();

$(document).ready(function(){

    let networkName = getQueryStringParam('name');
    let container = document.getElementById('mynetwork');
    let network = new VisNetwork(container, new VisNetworkData(networkName));

    persistence.documentLoaded(network);
    ConnectionStatusModule.documentLoaded();

    $('h1').text(networkName);
    document.getElementById("exportButton").onclick = function(e){
        e.preventDefault();
        persistence.exportNetwork();
    };
    document.getElementById("saveAndQuitButton").onclick = saveAndGoHome;

});

function saveAndGoHome(e) {
	e.preventDefault();

    persistence.exportNetwork(network);
	location.href = "/";
}
