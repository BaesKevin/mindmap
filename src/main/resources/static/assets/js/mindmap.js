let network;


function createNetwork(){
	let container = document.getElementById('mynetwork');
	network = new VisNetwork(container, new VisNetworkData());
}

function serverMatchesStorage(dataFromServer, dataFromStorage){
	let oldData = {
			nodes: dataFromStorage.nodes.get(),
			edges: dataFromStorage.edges.get()
	}
	
	let newData = {
			nodes: dataFromServer.nodes.get(),
			edges: dataFromServer.edges.get()
	}
	
	return areNetworksEqual(oldData, newData);
	
}

// first check if there are an equal amount of nodes and edges
// then check each property of a node from storage against the matching property
// of a node from the server
function areNetworksEqual(oldData, newData){
	if(oldData.nodes.length !== newData.nodes.length || oldData.edges.length !== newData.edges.length){
		return false;
	}
	
	// TODO remove duplication
	let areEqual = true;
	oldData.nodes.forEach(function(oldNode){
		newNode = newData.nodes.find(node => node.id == oldNode.id);
		
		if(!newNode){
			areEqual = false;
		}
		
		for(key in oldNode){
			let oldVal = oldNode[key];
			let newVal = newNode[key];
			
			if(!(oldNode.hasOwnProperty(key) && oldVal === newVal)){
				
				// account for precision error on floats
				if(isNumeric(oldNode[key])){
					let numbersAreCloseEngough = Math.floor(oldVal) === Math.floor(newVal);

					if(!numbersAreCloseEngough){
						areEqual = false;
					}
				} else {
					areEqual = false;
				}
			}
		}
	});
	
	oldData.edges.forEach(function(oldEdge){
		newEdge = newData.edges.find(edge => edge.id == oldEdge.id);
		
		if(!newEdge){
			areEqual = false;
		}
		
		for(key in oldEdge){
			if(!(oldEdge.hasOwnProperty(key) && oldEdge[key] === newEdge[key])){
				areEqual = false;
			}
		}
	});
	
	return areEqual;
}


function exportNetwork(e) {
	if(e) e.preventDefault();

    let networkName = getQueryStringParam('name');
	let exportData = new NetworkExportData(networkName, network.networkData);
    
    exportNetworkToStorage(exportData);
    exportNetworkToServer(exportData).then(_ => {
    	$('[data-toggle="offCanvas"]').click();
    });
}



function exportNetworkToStorage(data){
	localforage
	    .setItem(data.name, JSON.stringify(data))
	    .catch(error => console.info("LocalForage couldn't save network " + networkName));
}

function exportNetworkToServer(data){

    return postData("/savemindmap", data)
    	.then(response => {
    			return Promise.resolve(response.text());
    		}
    	)
    	.catch(error => {
			console.info("couldn't save network to server"); throw error;
    	});
}

// load the network from storage and server, check if they match, overwrite
// server with localstorage
// TODO give the user a choice to overwrite server with localstorage or vice
// versa,
// useful when the user worked in a different browser or on a different device
function importNetwork(e) {
    if(e){
        e.preventDefault();
    }

    let networkName = getQueryStringParam('name');

    if(!networkName){
    	location.href = "/";
    }
    
    loadNetworkFromStorage(networkName)
    	.then(dataFromStorage => {
    		loadNetworkFromserver(networkName).then(dataFromServer => {
    			let isServerSynced = serverMatchesStorage(dataFromServer, dataFromStorage);
    			console.log("Server is synced: " + isServerSynced);
    			
    			if(!isServerSynced){
    				syncBasedOnUsersChoice(dataFromStorage, dataFromServer);
    			} else {
        	    	network.initOrUpdateNetwork(dataFromServer);
    			}

    		});
		});
    	
    
}

// if the user wants to keep their local changes, push local changes to the
// server and init the network with local data
// else pull the remote changes, update local storage and load the network with
// remote changes
function syncBasedOnUsersChoice(dataFromStorage, dataFromServer){
	console.log("Server is not in sync: sync data");
	
	let syncStrategyModal =  $('#chooseSyncStrategyModal')
	
	syncStrategyModal.find('[data-sync-strategy="overwriteServer"]').one('click', function(e){
		e.preventDefault();
		
		let networkName = getQueryStringParam('name');
	    let exportData = {
	        name: networkName,
	        nodes: dataFromStorage.nodes.get(),
	        edges: dataFromStorage.edges.get()
	    };
		
		exportNetworkToServer(exportData).then(_ => console.log("sync successful"));
    	network.initOrUpdateNetwork(dataFromStorage);
    	syncStrategyModal.foundation("close");
	});
	
	syncStrategyModal.find('[data-sync-strategy="overwriteStorage"]').one('click', function(e){
		e.preventDefault();
		
		let networkName = getQueryStringParam('name');
	    let exportData = {
	        name: networkName,
	        nodes: dataFromServer.nodes.get(),
	        edges: dataFromServer.edges.get()
	    };
		
    	exportNetworkToStorage(exportData);
    	network.initOrUpdateNetwork(dataFromServer);
    	syncStrategyModal.foundation("close");
	});
	
	syncStrategyModal.foundation('open');
}

function loadNetworkFromStorage(networkName){
	return getNetworkFromStorage(networkName)
	.then(data => {
		return Promise.resolve(data);
	});
}

function loadNetworkFromserver(name){
	return fetch("mindmap/" + name, {
        credentials: 'same-origin'
	})
    .then(response => response.json())
    .then(json => {
    	let loaded_network_data = {
    		name: json.name,
    		nodes: new vis.DataSet(json.nodes),
    		edges: new vis.DataSet(json.edges)
    	}
    	
    	return Promise.resolve(loaded_network_data);
    })
    .catch(error => {
    	console.info("network not found on server");
    	console.log(error);
    });
    
}

function getNetworkFromStorage(name){
	return localforage.getItem(name)
    .then( networkFromStorage => {
    	
    	return createDataFromNetworkFromStorage(networkFromStorage);
    })
    .catch(error => console.info("network not found in storage"));
}

function createDataFromNetworkFromStorage(networkFromStorage){
	let newnodes, newedges;
	
	if(networkFromStorage !== null){
        let networkData = JSON.parse(networkFromStorage);
        newnodes = new vis.DataSet(networkData.nodes);
        newedges = new vis.DataSet(networkData.edges);

    } else {
    	newnodes = new vis.DataSet();
    	newedges = new vis.DataSet();
    }

	return {
    	name: name,
        nodes: newnodes ,
        edges: newedges
    };
}


function saveAndGoHome(e){
	e.preventDefault();
	
	exportNetwork();
	location.href="/";
}
