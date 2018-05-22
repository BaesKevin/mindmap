
let network;
let data;
let nodes;
let edges;
let visNetworkOptions = {
        interaction:{hover:true},
        manipulation: {
            enabled: true,
            editNode: editNode
        },
        edges: {
            arrows: 'to',
            smooth: {
                type: "cubicBezier",
                forceDirection: "none",
                roundness: 1
            }
        },
        physics: {
            enabled: false
        },
        interaction: {
        	navigationButtons: true	
        }
    };


function initNetwork(data){
    let container = document.getElementById('mynetwork');
    network = new vis.Network(container, data, visNetworkOptions);

}

function initOrUpdateNetwork(data){
	// update the global nodes and edges no matter what, these are used by the exportNetworkToStorage function
	nodes = data.nodes;
	edges = data.edges;
	if(network !== undefined){
		console.info("updating network");
		network.setData({nodes: data.nodes, edges: data.edges});
	} else {
		initNetwork(data);
	}
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
// then check each property of a node from storage against the matching property of a node from the server
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
			if(!(oldNode.hasOwnProperty(key) && oldNode[key] === newNode[key])){
				areEqual = false;
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

function editNode(data, callback) {
    document.getElementById('operation').innerHTML = "Edit Node";
    document.getElementById('node-label').value = data.label;
    document.getElementById('saveButton').onclick = saveData.bind(this, data, callback);
    document.getElementById('cancelButton').onclick = cancelEdit.bind(this,callback);

    let networkPopup = document.getElementById('network-popUp');
    networkPopup.className = "";
    let labelInput = document.querySelector("input#node-label");
    labelInput.setSelectionRange(0, labelInput.value.length);
}

function saveData(data,callback) {
    data.label = document.getElementById('node-label').value;
    clearPopUp();
    callback(data);
}

function clearPopUp() {
    document.getElementById('saveButton').onclick = null;
    document.getElementById('cancelButton').onclick = null;
    document.getElementById('network-popUp').className = "hidden";
}

function cancelEdit(callback) {
    clearPopUp();
    callback(null);
}

function exportNetwork(e) {
    e.preventDefault();

    let networkName = getQueryStringParam('name');
    let exportData = {
        name: networkName,
        nodes: nodes.get(),
        edges: edges.get()
    };
    
    exportData = convertToNetworkDataWithoutBloatProperties(exportData);
    
    exportNetworkToStorage(exportData);
    exportNetworkToServer(exportData).then(_ => {
    	$('[data-toggle="offCanvas"]').click();
    	alert("OK");;
    });
}

function convertToNetworkDataWithoutBloatProperties(data){
	let cleanData = {
		name: data.name,
		nodes: [],
		edges: data.edges
	};
	
	data.nodes.forEach(node => {
		let cleanNode = {
			id: node.id,
			label: node.label,
			x: node.x,
			y: node.y
		}
		
		cleanData.nodes.push(cleanNode);
	});
	
	return cleanData;
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

// load the network from storage and server, check if they match, overwrite server with localstorage
// TODO give the user a choice to overwrite server with localstorage or vice versa,
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
        	    	initOrUpdateNetwork(dataFromServer);
    			}

    		});
		});
    	
    
}

// if the user wants to keep their local changes, push local changes to the server and init the network with local data
// else pull the remote changes, update local storage and load the network with remote changes
function syncBasedOnUsersChoice(dataFromStorage, dataFromServer){
	console.log("Server is not in sync: sync data");
	
	let networkName = getQueryStringParam('name');
    let exportData = {
        name: networkName,
        nodes: dataFromServer.nodes.get(),
        edges: dataFromServer.edges.get()
    };
    
    let choice = askForSyncStrategy();
    
    if(choice === "overwriteServer"){
    	exportNetworkToServer(exportData);
    	initOrUpdateNetwork(dataFromStorage);
    } else if (choice === "overwriteStorage" ){
    	exportNetworkToStorage(exportData);
    	initOrUpdateNetwork(dataFromServer);
    }
}

function askForSyncStrategy(){
	return "overwriteServer";
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

