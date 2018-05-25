let network;

$(document).foundation();

$(document).ready(function(){
    document.getElementById("exportButton").onclick = function(e){
        e.preventDefault();
        persistenceModule.exportNetwork(network);
    };
    document.getElementById("saveAndQuitButton").onclick = saveAndGoHome;

    let networkName = getQueryStringParam('name');
    createNetwork(networkName);
    addOnlineOfflineEventListeners();
    persistenceModule.importNetwork(networkName);

    $('h1').text(networkName);
});

function createNetwork(networkName) {
	let container = document.getElementById('mynetwork');
	network = new VisNetwork(container, new VisNetworkData(networkName));

}

function saveAndGoHome(e) {
	e.preventDefault();

    persistenceModule.exportNetwork(network);
	location.href = "/";
}
